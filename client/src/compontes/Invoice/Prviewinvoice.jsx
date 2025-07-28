


import React from 'react'
import { useState } from 'react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../Home/Navbar"
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify"
import { ClipLoader } from "react-spinners"






function Prviewinvoice() {





  const downloadPdf2 = async () => {
    const invoice = document.getElementById("invoice-pdf");

    // Temporarily make the PDF section visible
    invoice.style.position = "static";
    invoice.style.left = "0";
    invoice.style.opacity = "1";

    try {
      const canvas = await html2canvas(invoice, {
        scale: 2, // Reduce scale to keep quality but limit size (try 1.5 or 2)
        useCORS: true, // Ensures proper rendering of external images
        allowTaint: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.5); // JPEG instead of PNG & reduced quality to 50%

      const pdf = new jsPDF({
        orientation: "p", // Portrait mode
        unit: "mm",
        format: "a4", // Standard A4 size
        compress: true, // Enable compression
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

    } catch (error) {

      console.error("Error generating PDF:", error);

    } finally {
      // Re-hide the PDF section
      invoice.style.position = "absolute";
      invoice.style.left = "-9999px";
      invoice.style.opacity = "0";
    }
  };

  const location = useLocation();
  const navigate = useNavigate()
  const [loder, setloader] = useState(false)

  console.log("props", location.state)

  const { invoiceData,
    discount,
    tottalAmount,
    subtotal } = location.state

  const downloadPdf = async () => {
    const invoice = document.getElementById("invoice-pdf");
    setloader(true)

    // Temporarily make the PDF section visible
    invoice.style.position = "static";
    invoice.style.left = "0";
    invoice.style.opacity = "1";
    let downloadPdf

    try {
      const canvas = await html2canvas(invoice, {
        scale: 2, // Reduce scale to keep quality but limit size (try 1.5 or 2)
        useCORS: true, // Ensures proper rendering of external images
        allowTaint: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.5); // JPEG instead of PNG & reduced quality to 50%

      const pdf = new jsPDF({
        orientation: "p", // Portrait mode
        unit: "mm",
        format: "a4", // Standard A4 size
        compress: true, // Enable compression
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      downloadPdf = pdf

      // invoice.style.position = "absolute";
      // invoice.style.left = "-9999px";
      // invoice.style.opacity = "0";

      // pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

      const finalData = {

        invoiceData,
        discount,
        tottalAmount,
        subtotal
      }


      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("finalData", JSON.stringify(finalData));
      formData.append("pdf", pdfBlob, `invoice-${invoiceData.invoiceNumber}.pdf`);


      // downloadPdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);


      const result = await axios.post("https://cc-server-7u7u.onrender.com/api/invoice/serviceinvoice", formData)
      // const result = await axios.post("http://localhost:3018/api/invoice/serviceinvoice", formData)

      // console.log(result.data)
      // alert("invoice sent to whatsapp !! ")
      toast.success("invoice sent to whatsapp !! ")
      // window.open(result.data.whatsappLink, "_blank");
      navigate("/invoice")


    } catch (error) {

      // toast.error("invoice whatsapp sent failed !!")
      // alert("invoice sent to whatsapp failed please download !! ")
      toast.warning("invoice sent to whatsapp failed please download !!")
      downloadPdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

      console.log("err")
      console.error("Error generating PDF:", error);
      navigate("/home")
    } finally {
      setloader(false)
      // Re-hide the PDF section
      invoice.style.position = "absolute";
      invoice.style.left = "-9999px";
      invoice.style.opacity = "0";
    }
  };









  return (
    <div>
      <Navbar />


      <div className='w-full h-[100px] flex justify-end pr-[200px]' >

        <button
          onClick={downloadPdf}
          className="w-[150px] mt-[50px] h-[50px] bg-[#1f709f] text-white text-[17px] rounded-md hover:bg-blue-600"
        >
          {
            loder ?
              <ClipLoader color='white' size={20} />
              :
              "Sent Invoice"


          }

        </button>



      </div>


      <div className=' shadow-[0px_4px_10px_rgba(0,0,0,0.25)]'
        style={{

          width: "230mm",
          minHeight: "300mm",
          // padding: "20mm",
          backgroundColor: "white",
          color: "#000",
          fontFamily: "Arial, sans-serif",
          margin: "20px auto", // Center align
          display: "block",


        }} >



        <div
          id="invoice-pdf"
          className=''
          style={{

            width: "230mm",
            minHeight: "300mm",
            // padding: "20mm",
            backgroundColor: "white",
            color: "#000",
            fontFamily: "Arial, sans-serif",
            margin: "20px auto", // Center align
            display: "block",
            backgroundImage: "url('ccseal.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "50% auto",
            pointerEvents: "none",
            "::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "inherit",
              opacity: 0.3, // Adjust this value (0.1-0.3)
              pointerEvents: "none"
            }

          }}
        >


          <div className='w-full h-[150px] flex  ' >

            <div className='w-[50%] h-[100%] flex justify-start  pl-[30px]  pt-[25px]' >

              <img className='h-[120px] w-[90%] ' src="./cctitle.png" alt="title image" />
            </div>

            <div className='w-[50%] h-[100%] flex justify-end font-semibold pt-[40px] text-[17px] pr-[30px] text-[#1f709f] '  >

              <h1> Perumpilavu - Thrissur-Dist <br />

                Mob:9744691771 | 9746157006


              </h1>

            </div>

          </div>
          <div className='w-full  h-[3px] bg-[#1f709f]' ></div>

          <div className='w-full h-[150px]  flex justify-end items-center ' >

            <div className='mr-[150px] ' >

              <h1> Invoice No: <span className='font-semibold' >{invoiceData?.invoiceNumber}</span> </h1>
              <h1> Invoice Date: <span className='font-semibold' >{invoiceData?.date}</span> </h1>

            </div>

          </div>



          <div className='w-full h-[150px]    ' >

            <div className='ml-[40px]  ' >

              <h1> Customer Name: <span className='font-semibold' >{invoiceData?.customer?.name}</span></h1>
              <h1> Address: <span className='font-semibold' >{invoiceData?.customer?.address}</span> </h1>
              <h1> Mobile No: <span className='font-semibold' >{invoiceData?.customer?.mob}</span> </h1>

            </div>

          </div>




          <div className="w-full p-[40px]  ">
            <table className="w-full border-collapse  ">
              <thead>
                <tr className="bg-[#1f709f] text-white">
                  <th className="border-r border-[#1f709f] px-4 py-2 text-left">PARTICULARS</th>
                  <th className="border-r border-[#1f709f] px-4 py-2">PRICE</th>
                  <th className="border-r border-[#1f709f] px-4 py-2">QTY</th>
                  <th className=" px-4 py-2">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((row, index) => (
                  <tr key={index} className="">
                    <td className=" border-r border-[#1f709f]  px-4 py-4"> {row?.brand} {row?.brand && "-"} {row?.description}</td>
                    <td className="border-r border-[#1f709f] px-4 py-4 text-center">{row?.price > 0 ? row?.price : ""}</td>
                    <td className=" border-r border-[#1f709f] px-4 py-2 text-center">{row?.quantity > 0 ? row.quantity : ""}</td>
                    <td className=" px-4 py-2 text-center">

                      {row?.quantity * row?.price > 0 ? (row.quantity * row.price).toFixed(2) : ""}

                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#1f709f] text-white">
                  <td colSpan={3} className="border border-[#1f709f] px-4 py-2 text-right font-bold">
                    TOTAL
                  </td>

                  <td className="border border-[#1f709f] px-4 py-2 text-center font-bold">{subtotal}</td>
                </tr>


                {
                  discount > 0 ? <tr className="bg-[#1f709f] text-white">
                    <td colSpan={3} className="border border-[#1f709f] px-4 py-2 text-right font-bold">
                      DISCOUNT
                    </td>

                    <td className="border border-[#1f709f] px-4 py-2 text-center font-bold">{discount}</td>
                  </tr>
                    : null
                }


                <tr className="bg-[#1f709f] text-white">
                  <td colSpan={3} className="border border-[#1f709f] px-4 py-2 text-right font-bold">
                    PAY AMOUNT
                  </td>

                  <td className="border border-[#1f709f] px-4 py-2 text-center font-bold">{tottalAmount}</td>
                </tr>




              </tfoot>
            </table>
          </div>











          {/* <div className='w-full h-[150px]  flex justify-end   ' > */}


          {/* </div> */}







        </div>








      </div>

















    </div>


  )
}

export default Prviewinvoice