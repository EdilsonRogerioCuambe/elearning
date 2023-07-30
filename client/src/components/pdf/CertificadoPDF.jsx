import React from 'react';
import {
  Document,
  Page,
} from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const CertificadoPDF = ({ certificado }) => {
  return (
    <>
      <Document
        file={certificado}
        onLoadSuccess={console.log('PDF carregado com sucesso!')}
      >
        <Page pageNumber={1} />
      </Document>
    </>
  );
};

export default CertificadoPDF;