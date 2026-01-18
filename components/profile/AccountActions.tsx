/*
  Account actions card for sign out and account deletion.
*/
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AccountActions() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/signout", { method: "POST" })
    } catch {
      toast.error("Failed to sign out. Please try again.")
      setIsLoggingOut(false)
      return
    }
    window.location.href = "/"
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch("/api/account/delete", { method: "POST" })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete account")
      }
      setShowDeleteDialog(false)
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete account. Please try again.")
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <h2 className="text-xl font-semibold text-foreground">Account actions</h2>
      <div className="mt-5 space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </Button>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting}
            >
              <Trash2 className="mr-3 h-4 w-4" />
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>This action is permanent and cannot be undone.</p>
                <p>Your profile and subscription data will be removed.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Keep account</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleDeleteAccount()
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  )
}
