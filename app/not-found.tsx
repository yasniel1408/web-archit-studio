import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-600">Página no encontrada</h2>
        <p className="mb-8 text-gray-500">Lo sentimos, la página que buscas no existe.</p>
        <Link
          href="/"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
