# Production checklist

## Required before real financial data

- Configure private authentication and verified email.
- Store secrets only in the hosting provider secret manager.
- Enable encrypted database backups and test restoration.
- Add row-level access rules for every financial table.
- Remove all sample figures when the first account is created.
- Record consent before uploading any statement.
- Keep receipt OCR on the user's device.
- Test statement imports against redacted samples from each supported bank.
- Complete dependency and vulnerability review.
- Add account export and permanent deletion flows.

## PWA

The manifest and offline application shell are included. Install from the browser menu after deployment over HTTPS.

## Windows

The deployed PWA is the first Windows application format. A signed standalone installer requires a production URL and a Windows code-signing certificate.
