import { pdfjs } from 'react-pdf';
import {
  Document,
  Page,
} from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const CertificadoPDF = ({ certificados }) => {

  console.log(certificados);

  return (
    <>
      <section className="pt-10">
        <h1 className="text-4xl mb-10 uppercase text-green-400 font-bold font-mono">Certificados</h1>
        <div className="flex flex-wrap">
          {certificados.map((certificado) => (
            <div key={certificado} className="rounded-lg overflow-hidden shadow-lg border-2 border-green-400 bg-transparent cursor-pointer">
              <Document
                file={certificado}
                className="h-60"
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CertificadoPDF;