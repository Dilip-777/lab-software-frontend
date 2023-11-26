import { api } from "../Api";

interface Props {
  packages: OrderPackage[];
  profiles: OrderProfile[];
  tests: OrderTest[];
  patient: Patient;
  order: Order;
  selected?: any[];
  departments: Department[];
  letterhead: boolean;
  printSetting: PrintSetting | undefined;
}

const getnote = (note: string) => {
  const retrievedText = note.replace(/\n/g, "<br>");
  return retrievedText;
};

const getReferenceValue = (test: Test, patient: Patient) => {
  const r = test.referencesValues.find(
    (ref) => patient && ref.minAge <= patient?.age && ref.maxAge >= patient?.age
  );
  if (r)
    return (
      getnote(r.note || "") || `${r.lowerValue} - ${r.upperValue} ${r.unit}`
    );
  else if (test.referencesValues.length > 0)
    return (
      getnote(test.referencesValues[0].note || "") ||
      `${test.referencesValues[0].lowerValue} - ${test.referencesValues[0].upperValue} ${test.referencesValues[0].unit}`
    );
  else return "-";
};

export const generateReport = async ({
  packages,
  profiles,
  tests,
  patient,
  order,
  selected,
  departments,
  letterhead,
  printSetting,
}: Props) => {
  const signs = `
        <div>
        <div style="font-size: 12px; display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; position: relative;   max-width: 100%;  font-family: 'Poppins', sans-serif; margin: 0;page-break-after: always;">
         ${departments
           .map(
             (department) => `
          <div style="display: flex; flex-direction: column; align-items: center;">
                <img src="http://localhost:5000/uploadedFiles/${department.doctorSignature}" style="width: 100px; height: 100px; object-fit: contain;"/>
                <p style="font-size: 12px; font-weight: bold;">${department.doctor}</p>
            </div>
         `
           )
           .join("")}
           ${
             printSetting?.showendline &&
             printSetting.endlineposition === "false"
               ? `<p style='text-align: center; margin-top: 1rem; font-size: 12px; font-weight: bold; grid-column: 1'>${printSetting.endline}</p>`
               : ""
           }
    </div>
        </div>`;

  const testTable = (test: OrderTest) => {
    console.log(test.test.note);

    return `
        <tr style="break-inside: avoid; ">
            <td style="padding-left:0px; font-size:13px; text-align: left; min-width: 11rem; max-width: 11rem; margin-right: 1rem; word-wrap: break-word">
             <div >
             <p style="margin-bottom:2px;">${test.name}</p>

                <p style="font-size:10px; margin-top:0;">${
                  test.testmethodtype || test.test.testmethodtype || ""
                }</p>
            </td>
            <td style=" text-align: center;font-weight: ${
              test.highlight === "High" || test.highlight === "Low"
                ? "bold"
                : "normal"
            } ">${test.observedValue}</td>
            <td style=" text-align: center; padding-right: 2rem;font-weight: ${
              test.bold ? "bold" : "normal"
            }">${test.highlight || "-"}</td>
            <td style=" text-align: left;">${test.sampleunit || "-"}</td>
            <td style=" text-align: left;">${getReferenceValue(
              test.test,
              patient
            )}</td>
        </tr>

        
          <tr style="break-inside: avoid;"><td colspan='5' style='padding-top: 0.7rem;padding-left:0; text-align: left;'>
          ${test.test.note || ""}
          </td></tr>
        
    `;
  };

  const profileTable = (profile: OrderProfile) => {
    return `
       <tr>
            <td style="padding-left:0px;"> <p style="margin-top: 9px; margin-bottom: 9px; font-size: 14px;"><strong>${
              profile.name
            }</strong></p></td>
        </tr>

        ${profile.headings
          .filter(
            (heading) =>
              heading.tests.filter((test) => test.observedValue).length > 0
          )
          .map(
            (heading) => `
        <tr>
            <td style="padding-left:0px; text-align: left; font-size: 13px; font-weight: bold;">${
              heading.heading
            }</td>
            <td style=" text-align: center;"></td>
            <td style=" text-align: center;"></td>
            <td style=" text-align: left;"></td>
            <td style=" text-align: center;"></td>
        </tr>
        ${heading.tests
          .filter((test) => test.observedValue)
          .map((test) => testTable(test))
          .join("")}
        `
          )
          .join("")}


        ${profile.tests
          .filter((test) => test.observedValue)
          .map((test) => testTable(test))
          .join("")}

    `;
  };

  const tableHead = `
            <thead>
                <tr>
                    <th style=" text-align: left; padding-left: 0;">Investigation</th>
                    <th style=" text-align: center;">Obtained Value</th>
                    <th style=" text-align: left;"></th>
                    <th style=" text-align: left;">Units</th>
                    <th style=" text-align: left;">Reference Intervals</th>
                </tr>    
            </thead>`;

  let combinedHtml = "";
  packages
    .filter(
      (p) =>
        selected &&
        selected.find((s) => s.type === "package" && s.name === p.name)
    )
    .forEach((pkg) => {
      combinedHtml += `
         <div
    style="font-size: 12px; position: relative;page-break-after: always; pb-10; background-size: contain; max-width: 100%; background-repeat: no-repeat; font-family: 'Poppins', sans-serif; margin: 0;">
    <div style=" ">
                
                    <p style="margin-top: 9px; margin-bottom: 9px; font-size: 15px;font-weight: bolder;">${
                      pkg.name
                    }</p>

            
         <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 13px;">

         ${tableHead}
            <tbody style="font-size: 13px;">
                 ${pkg.profiles
                   .map((profile) => profileTable(profile))
                   .join("")}
                 <tr>
                   <td></td>
                   <td></td>
                   <td></td>
                   <td></td>
                   </tr>
                   ${pkg.tests.map((test) => testTable(test)).join("")}

            </tbody>
            </table>     
        </div>
       
    </div>
    ${
      profiles.filter(
        (p) =>
          selected &&
          selected.find((s) => s.type === "profile" && s.name === p.name)
      ).length === 0 &&
      tests
        .filter(
          (p) =>
            !selected ||
            selected.find((s) => s.type === "test" && s.name === p.name)
        )
        .filter((test) => test.observedValue).length === 0
        ? signs
        : ""
    }
</div>`;
    });

  profiles
    .filter(
      (p) =>
        selected &&
        selected.find((s) => s.type === "profile" && s.name === p.name)
    )
    .forEach((profile, index) => {
      combinedHtml += `
            <div
    style="font-size: 12px; position: relative;${
      printSetting?.profilenewpage ||
      (!printSetting?.testprofilesamepage &&
        index ===
          profiles.filter(
            (p) =>
              selected &&
              selected.find((s) => s.type === "profile" && s.name === p.name)
          ).length -
            1)
        ? "page-break-after: always;"
        : ""
    } padding: 9px; pb-10; background-size: contain; max-width: 100%; background-repeat: no-repeat; padding-bottom: 0rem; font-family: 'Poppins', sans-serif; margin: 0;">
    <div style=" ">
       
       
                
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 13px;">
                ${tableHead}
                <tbody style="font-size: 13px;">
                   ${profileTable(profile)}
                </tbody>
            </table>    
        </div>
        <div style="border-top: 1px solid black; width: 100%;margin-top: 0.5rem;"></div>
        ${
          tests
            .filter(
              (p) =>
                !selected ||
                selected.find((s) => s.type === "test" && s.name === p.name)
            )
            .filter((test) => test.observedValue).length === 0
            ? signs
            : ""
        }
    </div>
</div>
        `;
    });

  tests
    .filter(
      (p) =>
        !selected ||
        selected.find((s) => s.type === "test" && s.name === p.name)
    )
    .filter((test) => test.observedValue)
    .forEach((test, index) => {
      combinedHtml += `
            <div
    style="font-size: 12px; position: relative; padding: 9px;  max-width: 100%;  font-family: 'Poppins', sans-serif; ${
      printSetting?.testnewpage ? "page-break-after: always;" : ""
    }">
    <div
    <div >
      

         <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 13px;">
           ${tableHead}    
                <tbody style="font-size: 13px;">
               <tr>
            <td style="padding-left:0px; text-align: left; font-size: 13px; font-weight: bold;">${
              test.test.name
            }</td>
            </tr>
              ${testTable(test)}
            </tbody>
               
            </table>     
        </div>
        
       
          ${
            printSetting?.showendline && printSetting.endlineposition === "true"
              ? `<p style='text-align: center; margin-top: 1rem; font-size: 12px; font-weight: bold;'>${printSetting.endline}</p>`
              : ""
          }

        ${
          index ===
          tests
            .filter(
              (p) =>
                !selected ||
                selected.find((s) => s.type === "test" && s.name === p.name)
            )
            .filter((test) => test.observedValue).length -
            1
            ? signs
            : ""
        }
    </div>
</div>
        `;
    });

  // combinedHtml += signs

  try {
    const response = await api.post(
      "/generatereport",
      {
        patient,
        letterhead,
        order,
        html: `<!DOCTYPE html>
<html>
<style>
  td{
    padding-left: 7px;

  }
  th{
    padding-left: 7px;
  }
  </style>
  <body style="">
   ${combinedHtml}
  </body>
 </html>       
        `,
      },
      {
        responseType: "blob",
      }
    );

    const pdfBlob = new Blob([response.data], { type: "application/pdf" });

    const pdfUrl = URL.createObjectURL(pdfBlob);

    // const downloadLink = document.createElement("a");
    // downloadLink.href = pdfUrl;
    // downloadLink.download = "generated_table.pdf";
    // downloadLink.click();

    // URL.revokeObjectURL(pdfUrl);
    return pdfUrl;
  } catch (error) {
    console.error(error);
  }
};
