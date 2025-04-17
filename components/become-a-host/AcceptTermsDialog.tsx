"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { showError } from "@/util/catchError";
import { acceptListingTerms } from "@/util/routes";

interface Props {
  showDilaog: boolean;
}

const AcceptTermsDialog = ({ showDilaog }: Props) => {
  const [open, setOpen] = useState(showDilaog);
  const [loading, setLoading] = useState(false);

  const acceptAgreement = async () => {
    setLoading(true);

    try {
      await axios.get(acceptListingTerms);

      setOpen(false);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen} defaultOpen={showDilaog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Listing Agreement</AlertDialogTitle>
          <AlertDialogDescription>
            By continuing you are agrre to{" "}
            <Link
              href="/listing-agreement"
              target="_blank"
              className="underline"
            >
              Listing Agreement
            </Link>{" "}
            for property owners
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={acceptAgreement}
            loading={loading}
            disabled={loading}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptTermsDialog;
