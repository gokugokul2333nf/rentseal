"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AgreementDraft,
  AgreementType,
  FurnitureItem,
  Party,
  PlanId,
} from "./types";

const STORAGE_KEY = "lp-stamp-paper:draft:v1";

function emptyParty(): Party {
  return {
    fullName: "",
    relation: "son",
    parentName: "",
    partyType: "individual",
    companyName: "",
    designation: "",
    age: "",
    phone: "",
    email: "",
    aadhaar: "",
    pan: "",
    address: "",
    city: "",
    pincode: "",
  };
}

/** Placeholder until the client mints a real one — keeps SSR and hydration identical. */
export const PENDING_ID = "LP-DRAFT";

export function newDraftId() {
  return `LP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Deterministic by design: no Date.now(), no Math.random(). The provider fills
 * in the id, start date and timestamp once, on the client, after mount.
 */
export function createDraft(type: AgreementType = "residential"): AgreementDraft {
  return {
    id: PENDING_ID,
    type,
    plan: "standard",
    landlord: emptyParty(),
    tenant: emptyParty(),
    property: {
      kind: type === "commercial" ? "office" : "apartment",
      doorNo: "",
      buildingName: "",
      street: "",
      locality: "",
      city: "",
      district: "",
      pincode: "",
      builtUpArea: "",
      bedrooms: "2",
      bathrooms: "2",
      floor: "",
      wholeProperty: true,
      portionDescription: "",
      furnishing: "semi-furnished",
      amenities: [],
    },
    terms: {
      executionDate: "",
      executionPlace: "",
      startDate: "",
      durationMonths: type === "commercial" || type === "lease" ? 36 : 11,
      monthlyRent: "",
      securityDeposit: "",
      rentDueDay: "5th",
      paymentMode: "bank-transfer",
      escalationPercent: "5",
      escalationAfterMonths: "11",
      noticePeriodMonths: "1",
      lockInMonths: "0",
      maintenanceBorneBy: "tenant",
      maintenanceAmount: "",
      electricityBorneBy: "tenant",
      waterBorneBy: "tenant",
      propertyTaxBorneBy: "landlord",
      depositAlreadyPaid: false,
      // The sample allows two months of continuous default before eviction,
      // which is the usual figure in Tamil Nadu agreements.
      defaultMonths: "2",
    },
    options: {
      parkingIncluded: true,
      parkingType: "four-wheeler",
      parkingSlots: "1",
      petsAllowed: false,
      sublettingAllowed: false,
      commercialUseAllowed: type === "commercial",
      businessNature: "",
      alterationsAllowed: false,
      noWallDamage: true,
      noLiquorOrIllegalUse: true,
      registrationRequired: type === "lease",
      lawyerReview: false,
      witnessRequired: true,
      customClauses: [],
    },
    furniture: [],
    updatedAt: "",
  };
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

/**
 * Moving an in-progress draft onto a different instrument.
 *
 * Relabelling the old draft — which is what this used to do — produced a deed
 * headed COMMERCIAL RENTAL AGREEMENT carrying the residential answers
 * underneath: an eleven-month term where commercial defaults to thirty-six, a
 * flat where the property kinds are offices and warehouses, and the same
 * document number as the draft it came from. Worse, because the type field then
 * already matched, the reconciliation in BuilderShell saw nothing to do and the
 * instrument's own defaults were never applied at all.
 *
 * A different instrument is a different document. Only the facts that hold
 * either way survive — who the parties are and where the property is. Term,
 * escalation, lock-in, options, property kind and furniture all come from the
 * new type, and the draft takes a new number.
 */
function switchInstrument(previous: AgreementDraft, type: AgreementType): AgreementDraft {
  const fresh = createDraft(type);
  return {
    ...fresh,
    landlord: previous.landlord,
    tenant: previous.tenant,
    property: {
      ...fresh.property,
      doorNo: previous.property.doorNo,
      buildingName: previous.property.buildingName,
      street: previous.property.street,
      locality: previous.property.locality,
      city: previous.property.city,
      district: previous.property.district,
      pincode: previous.property.pincode,
      builtUpArea: previous.property.builtUpArea,
      floor: previous.property.floor,
    },
  };
}

interface StoreValue {
  draft: AgreementDraft;
  hydrated: boolean;
  /** True when an in-progress draft was moved onto a different instrument. */
  carriedOver: boolean;
  dismissCarriedOver: () => void;
  savedAt: Date | null;
  saving: boolean;
  update: (patch: DeepPartial<AgreementDraft>) => void;
  setParty: (which: "landlord" | "tenant", patch: Partial<Party>) => void;
  setType: (type: AgreementType) => void;
  setPlan: (plan: PlanId) => void;
  addFurniture: () => void;
  updateFurniture: (id: string, patch: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  addCustomClause: (text: string) => void;
  removeCustomClause: (index: number) => void;
  reset: (type?: AgreementType) => void;
}

const AgreementContext = createContext<StoreValue | null>(null);

function mergeDeep<T>(base: T, patch: DeepPartial<T>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    if (value === undefined) continue;
    const current = out[key];
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      out[key] = mergeDeep(current, value as never);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

export function AgreementProvider({
  children,
  initialType = "residential",
}: {
  children: React.ReactNode;
  initialType?: AgreementType;
}) {
  const [draft, setDraft] = useState<AgreementDraft>(() => createDraft(initialType));
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [carriedOver, setCarriedOver] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);
  // Monotonic — reusing furniture.length would collide after a delete.
  const counter = useRef(0);

  // Restore any in-progress draft, but honour the type the user just picked.
  // Also mints the id and default start date. All three are deliberately
  // client-only: doing them during render would make the server and client
  // markup differ and blow up hydration. React batches these into one render.
  useEffect(() => {
    let restored: AgreementDraft | null = null;
    let restoredSavedAt: Date | null = null;
    let switched = false;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AgreementDraft;
        if (parsed?.id && parsed?.terms) {
          const merged = mergeDeep(createDraft(initialType), parsed as DeepPartial<AgreementDraft>);
          if (parsed.type === initialType) {
            restored = merged;
            restoredSavedAt = parsed.updatedAt ? new Date(parsed.updatedAt) : null;
          } else {
            restored = switchInstrument(merged, initialType);
            switched = true;
            // A different instrument is a different document, so it has not
            // been saved yet — leaving the old timestamp would claim otherwise.
            restoredSavedAt = null;
          }
        }
      }
    } catch {
      // A corrupt draft should never block the builder — start clean instead.
    }

    setDraft((prev) => {
      const base = restored ?? prev;
      const next = { ...base };
      if (!next.id || next.id === PENDING_ID) next.id = newDraftId();
      if (!next.terms.startDate) next.terms = { ...next.terms, startDate: tomorrowISO() };
      if (!next.terms.executionDate) {
        next.terms = { ...next.terms, executionDate: new Date().toISOString().slice(0, 10) };
      }
      if (base.furniture.length) counter.current = base.furniture.length;
      return next;
    });
    setSavedAt(restoredSavedAt);
    setCarriedOver(switched);
    setHydrated(true);
    // Runs once; the picked type is captured at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave.
  useEffect(() => {
    if (!hydrated || !dirty.current) return;
    setSaving(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        const stamped = { ...draft, updatedAt: new Date().toISOString() };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
        setSavedAt(new Date());
      } catch {
        // Storage full or blocked — the in-memory draft still works.
      }
      setSaving(false);
    }, 650);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [draft, hydrated]);

  const update = useCallback((patch: DeepPartial<AgreementDraft>) => {
    dirty.current = true;
    setDraft((prev) => mergeDeep(prev, patch));
  }, []);

  const setParty = useCallback(
    (which: "landlord" | "tenant", patch: Partial<Party>) => {
      dirty.current = true;
      setDraft((prev) => ({ ...prev, [which]: { ...prev[which], ...patch } }));
    },
    [],
  );

  const setType = useCallback((type: AgreementType) => {
    dirty.current = true;
    setDraft((prev) => ({
      ...prev,
      type,
      terms: {
        ...prev.terms,
        durationMonths:
          type === "commercial" || type === "lease" ? Math.max(prev.terms.durationMonths, 12) : 11,
      },
      options: {
        ...prev.options,
        commercialUseAllowed: type === "commercial" ? true : prev.options.commercialUseAllowed,
        registrationRequired: type === "lease" ? true : prev.options.registrationRequired,
      },
      property: {
        ...prev.property,
        kind: type === "commercial" && prev.property.kind === "apartment" ? "office" : prev.property.kind,
      },
    }));
  }, []);

  const setPlan = useCallback((plan: PlanId) => {
    dirty.current = true;
    setDraft((prev) => ({ ...prev, plan }));
  }, []);

  const addFurniture = useCallback(() => {
    dirty.current = true;
    const id = `f-${(counter.current += 1)}`;
    setDraft((prev) => ({
      ...prev,
      furniture: [...prev.furniture, { id, name: "", quantity: "1", condition: "good" }],
    }));
  }, []);

  const updateFurniture = useCallback((id: string, patch: Partial<FurnitureItem>) => {
    dirty.current = true;
    setDraft((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }, []);

  const removeFurniture = useCallback((id: string) => {
    dirty.current = true;
    setDraft((prev) => ({ ...prev, furniture: prev.furniture.filter((f) => f.id !== id) }));
  }, []);

  const addCustomClause = useCallback((text: string) => {
    dirty.current = true;
    setDraft((prev) => ({
      ...prev,
      options: { ...prev.options, customClauses: [...prev.options.customClauses, text] },
    }));
  }, []);

  const removeCustomClause = useCallback((index: number) => {
    dirty.current = true;
    setDraft((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        customClauses: prev.options.customClauses.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const dismissCarriedOver = useCallback(() => setCarriedOver(false), []);

  const reset = useCallback((type: AgreementType = "residential") => {
    dirty.current = true;
    counter.current = 0;
    setCarriedOver(false);
    const fresh = createDraft(type);
    fresh.id = newDraftId();
    fresh.terms.startDate = tomorrowISO();
    setDraft(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSavedAt(null);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      draft,
      hydrated,
      carriedOver,
      dismissCarriedOver,
      savedAt,
      saving,
      update,
      setParty,
      setType,
      setPlan,
      addFurniture,
      updateFurniture,
      removeFurniture,
      addCustomClause,
      removeCustomClause,
      reset,
    }),
    [
      draft,
      hydrated,
      carriedOver,
      dismissCarriedOver,
      savedAt,
      saving,
      update,
      setParty,
      setType,
      setPlan,
      addFurniture,
      updateFurniture,
      removeFurniture,
      addCustomClause,
      removeCustomClause,
      reset,
    ],
  );

  return <AgreementContext.Provider value={value}>{children}</AgreementContext.Provider>;
}

export function useAgreement() {
  const ctx = useContext(AgreementContext);
  if (!ctx) throw new Error("useAgreement must be used inside <AgreementProvider>");
  return ctx;
}
