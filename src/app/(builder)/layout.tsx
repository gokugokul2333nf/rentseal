import { ScreenshotGuard } from "@/components/site/screenshot-guard";

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      {/*
        The drafter is where the finished instrument is on screen in full, and
        payment is taken on a call after it is sent — so this is the one place
        where a free copy of the document actually costs something. Printing is
        off here too; the stamped copy is emailed once the order is confirmed.
      */}
      <ScreenshotGuard />
    </>
  );
}
