import { api } from "../Api";

const MyComponent = () => {
  const handleGeneratePDF = async () => {
    try {
      const response = await api.post(
        "/generatepdf",
        {
          html: `<!DOCTYPE html>
<html>

<head>
    <title>Invoice</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;1,100&family=Roboto+Mono&family=Roboto+Slab:wght@500&family=VT323&display=swap"
        rel="stylesheet">
</head>

<body style="background-image: url('path/to/your/background_image.jpg'); background-repeat: repeat; ">

<div
    style="font-size: 12px; position: relative; padding: 9px; background-image: url('http://localhost:5000/images/bgimage.png');background-size: contain; max-width: 100%; background-repeat: no-repeat; padding-bottom: 2rem; padding-left: 2rem; padding-right: 2rem;font-family: 'Poppins', sans-serif;">
    <div style="margin-top: 1rem; ">

        <h4 style="margin-bottom: 3px; text-align:right; font-weight: bold; ">Bill Of Supply / Tax Invoice</h4>
        <div style="border-top: 1px solid black; width: 100%; margin-bottom: 0.5rem; margin-top: 2rem"></div>
        <div style="display: flex; justify-content: space-between; ">
            <div style="display: flex; flex-direction: column;">
                <p style="font-size: 15px; font-weight: bolder;margin:3px;">Mr Narayana Reddy S</p>
                <p style="font-size: 14px;margin: 2px;"><strong>Age : </strong> 66 Y M 0 D</p>
                <p style="font-size: 14px; margin: 2px;"><strong>Sex : </strong> Male</p>
                <p style="font-size: 14px;margin:2px;"><strong>PID : </strong> 897987987</p>
            </div>
            <div style="border-left: 1.5px solid black;  margin-left: 1rem; height: 6rem;"></div>
            <div style="display: flex; flex-direction: column; justify-self: flex-start;">
                <p style="font-size: 14px;margin:1px;">
                  <strong> Sample Collected At:</strong> <br>
            Krupanidhi book stall,</p>
            <p style="font-size: 14px;margin:1px;margin-top: 5px;">Ref. By: <strong>Dr. G Supraja Reddy</strong></p>
                </p>
            </div>
             <div style="border-left: 1.5px solid black;  margin-left: 1rem; height: 6rem;"></div>
              <div style="display: flex; flex-direction: column;">
                <p style="font-size: 12px;margin:1px;">
                   Registered On: <br>
                   11:18 AM 15 Aug, 23<br>
                   Collected on:<br>
                   11:43 AM 15 Aug, 23<br>
                   Reported on:<br>
                   12:11 PM 15 Aug, 23
                </p>
            </div>
        </div>
         <div style="border-top: 1px solid black; width: 100%; margin-bottom: 0.5rem; margin-top: 1rem;margin-bottom: 1rem;"></div>

        <p style="margin-top: 9px; margin-bottom: 9px; font-size: 15px;font-weight: bolder;">Package Name</p>

         <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 13px;">
            <thead>
                <tr style="">
                    <th style=" text-align: left;">Investigation</th>
                    <th style=" text-align: left;">Obtained Value</th>
                    <th style=" text-align: left;">Units</th>
                    <th style=" text-align: center;">Reference Intervals</th>
                </tr>
                
            </thead>
            
            <tbody style="font-size: 13px;">
            <tr>

           <td> <p style="margin-top: 9px; margin-bottom: 9px; font-size: 14px;"><strong>Profile Name</strong></p></td>
        </tr>
                <tr>
                    <td style=" text-align: left; max-width: 9.5rem; margin-right: 0.5rem;">IM0016-THYROID STIMULATING HORMONE (TSH), SERUM</td>
                    <td style=" text-align: left;">0.01</td>
                    <td style=" text-align: left;">uIU/ml</td>
                    <td style=" text-align: center;">0.27 - 4.2</td>
            </tbody>
            </table>

       


            
        </div>
        <div style="border-top: 1px solid black; width: 100%;margin-top: 0.5rem;"></div>

    </div>

</div>
</body>

<div style="font-size: 12px; position: relative; padding: 9px; background-image: url('http://localhost:5000/images/bgimage.png');background-size: contain; max-width: 100%; background-repeat: no-repeat; padding-bottom: 2rem; padding-left: 2rem; padding-right: 2rem; height: 90vh; margin-top: 1rem;">
</div>
<div style="font-size: 12px; position: relative; padding: 9px; background-image: url('http://localhost:5000/images/bgimage.png');background-size: contain; max-width: 100%; background-repeat: no-repeat; padding-bottom: 2rem; padding-left: 2rem; padding-right: 2rem; height: 90vh; margin-top: 1rem;">
</div>
</body>

</html>
    `,
        },
        {
          responseType: "blob", // Tell axios to expect a binary response (PDF)
        }
      );

      // Create a Blob object from the PDF data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the Blob to be used with anchor tag for download
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create an anchor element and trigger click to initiate download
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = "generated_table.pdf";
      downloadLink.click();

      // Revoke the URL object to free up resources
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
  );
};

export default MyComponent;
