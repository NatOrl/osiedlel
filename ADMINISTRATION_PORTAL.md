# Administracja portal

Open `/administration`. The public header and navigation remain visible before login. Use the existing demo password `admin123`. The dashboard uses its own sidebar and returns to the public layout on logout or navigation away.

## Implemented

- Responsive forest-green dashboard, six management cards, tablet/mobile drawer and browser-local recent-change history.
- Existing PostgreSQL-backed article, document and employee-duty editors retained.
- Important notice editor includes publication/validity dates, importance flag and image upload. Changes affect the existing public important-notices feed (which deliberately filters future publications and expired notices).
- Gallery, resident information, events and council entries are stored in PostgreSQL in `admin_content`. Gallery supports importing the existing static photo list, image uploads and explicit earlier/later ordering controls.
- PDF upload and replacement through `/api/upload/document` (10 MB maximum). Image uploads use the existing image endpoint (5 MB maximum).

## Storage and deployment

Restart the backend after deployment. The new API initializes its `admin_content` table and the additional important-notice columns on first use. The database user therefore needs CREATE/ALTER privileges, and the existing `important_notices` table must already exist (see `backend/setup-homepage-content.js`). Uploaded files require persistent storage under `backend/uploads`.

**This is still a demo, not a production security boundary.** The password check and session flag are client-side, and the existing and new mutation endpoints are not protected by server-side authentication. Do not expose this API publicly until authentication and authorization cover all mutation and upload routes. File type checks use declared MIME type/extension; production uploads also require content inspection. Replacing/deleting an entry does not remove old uploaded files from disk.

The new gallery, council, events and resident-information editors persist their entries, but their existing public presentation components still use their current static content. Wiring those public components to the new content store is a separate integration step. Articles, documents, employee duties and important-notice text already use the existing public APIs. The public notices component does not yet render the newly stored image or importance flag.

Recent changes are the last eight operations recorded in the current browser, not a shared audit log.

## Validation

- Frontend: `npm run lint` and `npm run build` from the frontend directory.
- API route tests: `node --test admin-content.test.js` from the backend directory. These use an isolated Express server and a fake query adapter, not production database mutations.
- Syntax: `node --check server.js` and `node --check admin-content.js` from the backend directory.

No browser automation framework is installed, so visual browser/device verification remains manual.