









import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../Home/Navbar"
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
// import Select from "react-select";
import axios from "axios"
import { message } from "antd"
import { toast } from "react-toastify"
import { ClipLoader } from "react-spinners"




const EditableInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: "",
    customer: {
      name: "",
      address: "",
      mob: ""
    },
    items: [
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
      { brand: "", description: "", quantity: 0, price: 0, total: 0 },
    ],
    total: 0,
  });
  const navigate = useNavigate()
  const [loder, setloder] = useState(false)

  // const [inputValue, setInputValue] = useState("");
  // const [filteredOptions, setFilteredOptions] = useState([]);
  const [discount, setdiscount] = useState(0)
  // const [tottalAmount, settotalAmount] = useState(0)

  // const [description, setdescription] = useState([

  //   {
  //     opt: "Ac service",
  //     price: 600,
  //     qt: 1
  //   },
  //   {
  //     opt: "Ac water service",
  //     price: 1200,
  //     qt: 1
  //   },
  //   {
  //     opt: "Ac installation",
  //     price: 1200,
  //     qt: 1
  //   },
  //   {
  //     opt: "Ac capasitor change",
  //     price: 900,
  //     qt: 1
  //   },
  //   {
  //     opt: "Ac pcb service",
  //     price: 0,
  //     qt: 1
  //   },
  //   {
  //     opt: "Gas Charging",
  //     price: 0,
  //     qt: 1
  //   },
  //   {
  //     opt: "W/M motor change",
  //     price: 0,
  //     qt: 1
  //   },
  //   {
  //     opt: "W/M capasitor change",
  //     price: 0,
  //     qt: 1
  //   },
  //   {
  //     opt: "W/M service",
  //     price: 500,
  //     qt: 1
  //   },
  //   {
  //     opt: "W/M  pcb service",
  //     price: 500,
  //     qt: 1
  //   },
  //   {
  //     opt: "TV service",
  //     price: 700,
  //     qt: 1
  //   },
  //   {
  //     opt: "Refrigerator Compressor change",
  //     price: 700,
  //     qt: 1
  //   },
  //   {
  //     opt: "Compressor",
  //     price: 4500,
  //     qt: 1
  //   },
  //   {
  //     opt: "Filter",
  //     price: 350,
  //     qt: 1
  //   },
  //   {
  //     opt: "Transporting",
  //     price: 150,
  //     qt: 1
  //   },
  //   {
  //     opt: "Label Charge",
  //     price: 1200,
  //     qt: 1
  //   },
  //   {
  //     opt: "Gas",
  //     price: 1800,
  //     qt: 1
  //   },

  //   {
  //     opt: "Fanmotor changed",
  //     price: 1200,
  //     qt: 1
  //   },
  //   {
  //     opt: "Freezer",
  //     price: 2000,
  //     qt: 1
  //   },
  //   {
  //     opt: "TV backlight change",
  //     price: 0,
  //     qt: 1
  //   },
  //   {
  //     opt: "TV panal service",
  //     price: 0,
  //     qt: 1
  //   },

  //   {
  //     opt: "Ac refitting",
  //     price: 1800,
  //     qt: 1
  //   },
  //   {
  //     opt: "Other Expense",
  //     price: 0,
  //     qt: 1
  //   }





  // ])

  const [description, setdescription] = useState([])

  const getParticulars = async () => {

    try {

      const result = (await axios("https://cc-invoice-api.onrender.com/api/invoice/invoice-items")).data
      console.log("resut", result)
      setdescription(() => result?.data)

    } catch (error) {

      console.log("error", error)
      toast.error("network error")
    }
  }

  useEffect(() => {

    getParticulars()

  }, [])






  useEffect(() => {

    const today = new Date();
    const uuid = uuidv4();
    const randomNumber = parseInt(uuid.replace(/[^0-9]/g, "").slice(0, 2), 10);
    const day = today.getDate(); // Day of the month (1-31)
    const month = today.getMonth() + 1; // Full month name (e.g., January)
    const year = today.getFullYear(); // Y
    const invoiceNumberDefault = `CC${randomNumber}-${day}${month}${year}`

    setInvoiceData((prve) => ({

      ...prve,
      invoiceNumber: invoiceNumberDefault,
      date: new Date().toISOString().split("T")[0]
    }))

  }, [])

  const handleChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleItemChange = (index, field, value) => {
  //   const updatedItems = [...invoiceData.items];
  //   updatedItems[index][field] = value;
  //   setInvoiceData((prev) => ({
  //     ...prev,
  //     items: updatedItems,

  //   }));
  // };


  // working 

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;

    // Update total for the specific row
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;

    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };





  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  let tottalAmount = subtotal

  tottalAmount = subtotal - discount

  const finalData = {

    invoiceData,
    discount,
    tottalAmount,
    subtotal
  }

  // const downloadPdf = async () => {
  //   const invoice = document.getElementById("invoice-pdf");

  //   // Temporarily make the PDF section visible
  //   invoice.style.position = "static";
  //   invoice.style.left = "0";
  //   invoice.style.opacity = "1";

  //   try {
  //     const canvas = await html2canvas(invoice);
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();

  //     const imgWidth = pdf.internal.pageSize.getWidth();
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  //     // const pdfBlob = pdf.output("blob");
  //     // const pdfUrl = URL.createObjectURL(pdfBlob);


  //     pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);


  //     // const message = encodeURIComponent(`Here is your invoice. Click to download: ${pdfUrl}`);
  //     // const whatsappUrl = `https://wa.me/${7592831937}?text=${message}`;


  //     // window.open(whatsappUrl, "_blank");



  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   } finally {
  //     // Re-hide the PDF section
  //     invoice.style.position = "absolute";
  //     invoice.style.left = "-9999px";
  //     invoice.style.opacity = "0";
  //   }
  // };


  const downloadPdf = async () => {
    const invoice = document.getElementById("invoice-pdf");
    setloder(true)

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

      invoice.style.position = "absolute";
      invoice.style.left = "-9999px";
      invoice.style.opacity = "0";

      // pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("finalData", JSON.stringify(finalData));
      formData.append("pdf", pdfBlob, `invoice-${invoiceData.invoiceNumber}.pdf`);

      const result = await axios.post("https://cc-server-7u7u.onrender.com/api/invoice/serviceinvoice", formData)
      // const result = await axios.post("http://localhost:3018/api/invoice/serviceinvoice", formData)

      // console.log(result.data)
      // alert("invoice sent to whatsapp !! ")
      toast.success("invoice sent to whatsapp !!")

      // window.open(result.data.whatsappLink, "_blank");
      navigate("/invoice")


    } catch (error) {

      // toast.error("invoice whatsapp sent failed !!")
      // alert("invoice sent to whatsapp failed please download !! ")
      toast.warning("invoice sent to whatsapp failed please download !! ")
      downloadPdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

      console.log("err")
      console.error("Error generating PDF:", error);
      // message.success("invoice sent failed !!")
      navigate("/invoice")

    } finally {
      setloder(false)
      // Re-hide the PDF section
      invoice.style.position = "absolute";
      invoice.style.left = "-9999px";
      invoice.style.opacity = "0";

    }
  };


  const discriptionSeclect = (index, selectedOption) => {

    console.log(index, JSON.parse(selectedOption))

    const data = JSON.parse(selectedOption)
    const updatedItems = [...invoiceData.items];
    updatedItems[index]["description"] = data.particulars;
    updatedItems[index]["price"] = data.price;
    updatedItems[index]["quantity"] = data.quantity;


    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  }








  return (
    <div  >
      {/* Editable Invoice Section */}
      <Navbar />


      {/* form */}

      <div className="w-full  flex justify-center items-center pt-10 sm:pt-20px  px-4">
        <div className="w-full max-w-[1000px] h-auto pt-10 rounded-md bg-white shadow-md sm:shadow-[0px_4px_10px_rgba(0,0,0,0.25)] ">
          <h5 className="text-center text-[20px] font-semibold mb-6">Invoice</h5>
          <div className="w-full mt-5 flex flex-wrap gap-4 justify-center">
            <div className="w-full sm:w-auto flex flex-col">
              <label htmlFor="invoiceNo">No:</label>
              <input
                id="invoiceNo"
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                type="text"
                className="border border-black px-2 py-1 mt-1"
                disabled
              />

            </div>

            <div className="w-full sm:w-auto flex flex-col">
              <label htmlFor="invoiceDate">Date:</label>
              <input
                id="invoiceDate"
                onChange={(e) => handleChange("date", e.target.value)}
                type="date"
                className="border border-black px-2 py-1 mt-1"
                value={invoiceData.date}
              />
            </div>

            <div className="w-full sm:w-auto flex flex-col">
              <label htmlFor="customerName">Customer Name:</label>
              <input
                id="customerName"
                type="text"
                className="border border-black px-2 py-1 mt-1"
                onChange={(e) =>
                  setInvoiceData((prv) => ({
                    ...prv,
                    customer: { ...prv.customer, name: e.target.value },
                  }))
                }
              />
            </div>

            <div className="w-full sm:w-auto flex flex-col">
              <label htmlFor="customerAddress">Address:</label>
              <input
                id="customerAddress"
                type="text"
                className="border border-black px-2 py-1 mt-1"
                onChange={(e) =>
                  setInvoiceData((prv) => ({
                    ...prv,
                    customer: { ...prv.customer, address: e.target.value },
                  }))
                }
              />
            </div>

            <div className="w-full sm:w-auto flex flex-col">
              <label htmlFor="customerMobile">Mobile No:</label>
              <input
                id="customerMobile"
                type="text"
                className="border border-black px-2 py-1 mt-1"
                onChange={(e) =>
                  setInvoiceData((prv) => ({
                    ...prv,
                    customer: { ...prv.customer, mob: e.target.value },
                  }))
                }
              />
            </div>

            {/* <div className="w-full sm:w-auto flex flex-col">
              <label htmlFor="customerMobile">Tech Name:</label>
              <input
                id="customerMobile"
                type="text"
                className="border border-black px-2 py-1 mt-1"
                onChange={(e) =>
                  setInvoiceData((prv) => ({
                    ...prv,
                    customer: { ...prv.customer, mob: e.target.value },
                  }))
                }
              />
            </div> */}




          </div>

          <table className="w-full mt-5 border-collapse border border-gray-300 text-left text-sm">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="border border-gray-300 px-2 py-1">BRAND</th>
                <th className="border border-gray-300 px-2 py-1">Particulars</th>
                <th className="border border-gray-300 px-2 py-1">Quantity</th>
                <th className="border border-gray-300 px-2 py-1">Price</th>
                <th className="border border-gray-300 px-2 py-1">Total</th>
              </tr>
            </thead>
            < tbody >
              {
                invoiceData.items.map((item, index) => (
                  <tr key={index}>

                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="type"
                        value={item.brand}

                        onChange={(e) =>
                          handleItemChange(index, "brand", e.target.value)
                        }
                        className="w-full border border-black px-2 py-1"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <select
                        onChange={(e) => { discriptionSeclect(index, e.target.value) }}
                        className="w-full border border-black px-2 py-1"
                      >
                        <option value="">Select description</option>
                        {
                          description.map((data, index) => (

                            <option value={JSON.stringify(data)}>{data.particulars}</option>

                          ))
                        }
                      </select>


                      {/* <Select
                      options={options}
                      onChange={(selectedOption) => { discriptionSeclect(index, selectedOption) }}
                      className="w-full"
                      placeholder="Select or type..."
                      isSearchable
                    /> */}



                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        value={item.quantity === 0 ? "" : item.quantity}

                        onChange={(e) =>
                          handleItemChange(index, "quantity", Number(e.target.value))
                        }
                        className="w-full border border-black px-2 py-1"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        value={item.price === 0 ? "" : item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", Number(e.target.value))
                        }
                        className="w-full border border-black px-2 py-1"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {(item.quantity * item.price).toFixed(2)}

                    </td>
                  </tr>
                ))
              }
            </tbody >
          </table>

          <h6 className="text-right pr-6 mt-4 font-semibold">
            Total: {subtotal}
          </h6>

          <div className="w-full h-[50px] flex justify-end items-center gap-3 " >

            <>
              <label className="font-semibold " htmlFor=""> Discount </label>
              <input
                type="number"
                className="w-[100px] border border-black px-2 py-1 "
                value={discount}
                onChange={(e) => { setdiscount(e.target.value) }}
              />
            </>

          </div>

          <h6 className="text-right pr-6 mt-4 font-semibold">
            Pay Amount: {tottalAmount}
          </h6>


          <div className=" w-full flex justify-end mt-6  ">
            <button
              onClick={() => navigate("/privewInvoice", { state: finalData })}
              className=" hidden sm:block w-[100px] mb-10 mr-5 h-[30px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Preview
            </button>

            <button
              onClick={downloadPdf}

              className=" block sm:hidden w-[100px] mb-10 mr-5 h-[30px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {
                loder ?
                  <ClipLoader size={20} />
                  : "Sent Invoice"

              }

            </button>







          </div>
        </div>
      </div>

      {/* form */}



      {/* invoice  */}

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
          position: "absolute",
          opacity: 0,
          left: "-9999px",
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
        <div className='w-full h-[3px] bg-[#1f709f]' ></div>

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
                  <td className=" border-r border-[#1f709f]  px-4 py-4"><span className="mr-3" >{row?.brand}  </span> {row?.description}</td>
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




        {/* <div className='w-full h-[150px]  flex justify-end  ' > */}


        {/* </div> */}

















      </div>

      {/* invoice */}


      {/* <button onClick={downloadPdf}>Download Invoice as PDF</button> */}
    </div>
  );
};

export default EditableInvoice;

