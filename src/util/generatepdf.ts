import { api } from "../Api";

interface Props {
    tests: any[];
    totalamount: number;
    paidamount: number;
    discount: number;
    discountType: string;
    reflab: any;
    refdoctor: any;
    patient: any;
    paymentmethod: string;

}

export const generatepdf = async ({tests, totalamount, paidamount, discount, discountType,patient , reflab , refdoctor, paymentmethod}: Props) => {
    // console.log(discountType, discount, discount.toString() + discountType === "Percentage" ? "%" : "Rs" , "hjgjgjfghfghfjjhgjhgjhgjg");
    
    try {
      const response = await api.post(
        "/generatepdf",
        {
          html: `  <div style="font-size: 12px; position: relative; padding: 9px; background-image: url('http://localhost:5000/images/bgimage.png');background-size: contain; max-width: 100%; background-repeat: no-repeat; padding-bottom: 2rem; padding-left: 2rem; padding-right: 2rem;">
        <div style="margin-top: 1rem; ">
    
            <h4 style="margin-bottom: 3px; text-align:right; font-weight: bold; ">Bill Of Supply / Tax Invoice</h4>
            <div style="border-top: 1px solid black; width: 100%; margin-bottom: 0.5rem; margin-top: 2rem"></div>
            <div style="display: flex; justify-content: space-between; ">
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Name:</strong></div>
                        <div>${ patient.nameprefix + patient?.name}</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Age/Gender:</strong></div>
                        <div>${patient.age + " " + patient.agesuffix + " " + patient.gender}</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Contact No:</strong></div>
                        <div>${patient.phonenumber}</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Address:</strong></div>
                        <div>${patient.address}</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>UHID:</strong></div>
                        <div>DKBE-00897392</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Home Collection:</strong></div>
                        <div>Yes</div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Bill:</strong></div>
                        <div>DKBEB/21-22/0000019</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Visit/Reg Date:</strong></div>
                        <div>${new Date().toLocaleDateString('en-GB')}</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Referred By:</strong></div>
                        <div>${(reflab || refdoctor)}</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Visit No:</strong></div>
                        <div>Center</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Center Ph.No:</strong></div>
                        <div>8979879879</div>
                    </div>
                    <div style="display: flex; margin: 1px;">
                        <div style="min-width: 6rem;"><strong>Center Address:</strong></div>
                        <div style="max-width: 12rem;">No-603 GROUND FLOOR, KT MAINROAD, KPC LAYOUT , KASAVANAHALLI,
                            SARJAPUR MAIN ROAD, 50034</div>
                    </div>
                </div>
            </div>
    
            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 12px;">
                <thead>
                    <tr style=" border-top: 1px solid black; border-bottom: 1px solid black;">
                        <th style="padding: 0.5rem; text-align: left;">#</th>
                        <th style="padding: 0.5rem; text-align: left;">Service Code</th>
                        <th style="padding: 0.5rem; text-align: left;">Service Name</th>
                        <th style="padding: 0.5rem; text-align: center;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                  ${
                    tests.map((test, index) => (
                       `<tr>
                        <td style="padding: 0.5rem;">${index + 1}</td>
                        <td style="padding: 0.5rem; text-align: left;">${test.testcode || "-"}</td>
                        <td style="padding: 0.5rem; text-align: left;">${test.name}</td>
                        <td style="padding: 0.5rem; text-align: center;">${test.price}</td>
                    </tr>` 
                    ))
                  }
                    
                </tbody>
            </table>
    
    
            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
       <table style="width: 60%; border-collapse: collapse; font-size: 12px">
                    <tr style="border-collapse: collapse; border-top: 1px solid black; border-bottom: 1px solid black; max-height: 1rem; ">
                        <td style="padding-left: 0.5rem; font-weight: bold; text-align: left;">Payment Date</td>
                        <td style="padding-left: 0.5rem; font-weight: bold; text-align: left;">Payment Mode</td>
                        <td style="padding-left: 0.5rem; font-weight: bold; text-align: left;">Amount</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding-left: 0.5rem">${new Date().toLocaleDateString('en-GB')}</td>
                        <td style="text-align: left; padding-left: 0.5rem">${paymentmethod}</td>
                        <td style="text-align: left; padding-left: 0.5rem">${paidamount}</td>
                    </tr>
                </table>
             
    
                <table style="width: 35%; font-size: 12px; margin-left: auto;">
                    <tr>
                        <td style=" font-weight: bold;">Total amount:</td>
                        <td style=" text-align: center;">${totalamount}</td>
                    </tr>
                    <tr>
                        <td style=" font-weight: bold;">Discount Amount:</td>
                        <td style=" text-align: center;">${discount.toString() +  discountType }</td>
                    </tr>
                    <tr>
                        <td style=" font-weight: bold;">Total Paid Amount:</td>
                        <td style=" text-align: center;">${paidamount}</td>
                    </tr>
                </table>
            </div>
            <div style="border-top: 1px solid black; width: 100%;"></div>
    
        </div>
        <p><strong>Received with thanks:</strong> Six Hundred Only</p>
        <p>For any queries, kindly get in touch with us on <strong>cutomer.care@apollodiagnostic.in</strong> or call us on
            <strong>1800 103 2292</strong></p>
        
    </div>`,
        },
        {
          responseType: "blob", // Tell axios to expect a binary response (PDF)
        }
      );

      const pdfFile = new File([response.data], "Bill.pdf", { type: "application/pdf" });

      const formData = new FormData();

    formData.append("file", pdfFile);

       const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await api.post("/upload", formData, config);

   return res.data.data[0].filename
    

    //   const pdfBlob = new Blob([response.data], { type: "application/pdf" });

    //   const pdfUrl = URL.createObjectURL(pdfBlob);

    //   const downloadLink = document.createElement("a");
    //   downloadLink.href = pdfUrl;
    //   downloadLink.download = "generated_table.pdf";
    //   downloadLink.click();

    //   URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };