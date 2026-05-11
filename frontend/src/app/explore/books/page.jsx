// app/explore/books/page.jsx (or page.tsx)

import { Suspense } from "react";
import BooksClient from "./BookClient";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading books...</div>}>
      <BooksClient />
    </Suspense>
  );
}
