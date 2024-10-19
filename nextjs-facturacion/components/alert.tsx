import { useErrorInvoice, useInvoiceErrorActions } from '@/stores/invoices';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import * as React from 'react';


export default function AlertDialog() {
  const { closeError } = useInvoiceErrorActions()
  const errorInvoice = useErrorInvoice()
  const open = errorInvoice.Error
  const errorMessage = errorInvoice.errorMessage

  const handleClose = () => {
    closeError()
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="flex flex-row gap-3">
              <DangerousIcon />
              {errorMessage}
            </div>

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
