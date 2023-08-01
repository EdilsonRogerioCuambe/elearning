import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import { AiOutlineDownload } from 'react-icons/ai'; // Example icon from react-icons
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const CertificadoPDF = ({ certificados }) => {

  console.log(certificados);

  return (
    <>
      <section className="pt-10">
        <h1 className="text-4xl mb-10 uppercase text-green-400 font-bold font-mono">Certificados</h1>
        <div className="flex flex-wrap">
          {certificados.map((certificado, index) => (
            <>
              <div key={certificado} className="rounded-lg overflow-hidden shadow-lg border-2 border-green-400 bg-transparent cursor-pointer">
                <div className="px-6 py-4">
                  <a href={certificado} download className="flex items-center text-xl font-bold text-purple-800 mb-2">
                    <AiOutlineDownload className="text-2xl text-purple-800 mr-2" />
                    Baixar Certificado
                  </a>
                </div>
                <Document
                  file={certificado}
                  className="h-[420px]"
                >
                  <Page pageNumber={1} />
                </Document>
              </div>
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default CertificadoPDF;