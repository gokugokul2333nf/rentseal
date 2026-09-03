import { redirect } from "next/navigation";

/**
 * The catalogue lives at /templates.
 *
 * This route rendered a second grid of the same sixty-two documents, with the
 * same cards and the same links, one URL away from the one the header points
 * at. Two identical lists is a choice the reader has to make twice and a page
 * of duplicate content for a crawler to reconcile, so there is one list now and
 * this redirects to it. Every /create/<document> route is untouched: those are
 * the drafter itself, which is what the cards link to.
 */
export default function CreateIndex() {
  redirect("/templates");
}
