import { copyServiceText } from "@/utils/functions";

function insertCopyButton(element: HTMLElement) {
  let copyBtn = document.createElement("button");
  copyBtn.innerHTML = "Copy";
  copyBtn.classList.add("siebui-ctrl-btn", "appletButton");
  copyBtn.addEventListener("click", function () {
    let serviceInfo = getServiceInfo();
    if (serviceInfo["Registered Phone"] !== "") {
      copyServiceText({ brand: "Voltas", data: serviceInfo });
    }
  });

  element.insertAdjacentElement("beforebegin", copyBtn);
}

function getServiceInfo(): VoltasServiceInfo {
  let data: VoltasServiceInfo = {
    Account: "",
    "Account Type": "",
    "Activation Key": "",
    Agreement: "",
    "Alternate Phone": "",
    Appointment: "",
    Area: "",
    Assigned: "",
    Billable: "",
    Branch: "",
    "Brand Identifier": "",
    Building: "",
    "CSA Area Type": "",
    "Call Type": "",
    "Cancel Reason": "",
    Capacity: "",
    Category: "",
    City: "",
    "Closure Code": "",
    Contact: "",
    "Contact #": "",
    "Coupon Code": "",
    "Customer Mood": "",
    "Date Closed": "",
    District: "",
    "Email Address": "",
    Escalation: "",
    "External SR #": "",
    "External Ticket ID": "",
    "FSC Code": "",
    "Fee Amount": "",
    Group: "",
    "House #": "",
    "Installed By": "",
    "Invalid Code Remarks": "",
    "Key Account (P)": "",
    "Key Account (S)": "",
    Landmark: "",
    Model: "",
    "Model #": "",
    "Open Date": "",
    Pincode: "",
    "Program #": "",
    "Promo Code": "",
    "Purchase Date": "",
    "Purchased From": "",
    "Purchased From Code": "",
    "Purchased From Type": "",
    "Registered By": "",
    "Registered Phone": "",
    "Reopen Reason": "",
    Road: "",
    "SR #": "",
    "SR Value": "",
    "Serial #": "",
    "Serial #(Split)": "",
    "Service By": "",
    "Service Phone": "",
    Severity: "",
    State: "",
    Status: "",
    "Status Date": "",
    "Sub Area": "",
    Substatus: "",
    Symptom: "",
    "TCR #": "",
    "TCR Date": "",
    Technician: "",
    "Technician Phone": "",
    "Threshold Value": "",
    "Total Ereceipt": "",
    "Total Payment": "",
    "Total Value": "",
    Type: "",
    "Unit Status": "",
  };

  let table = document.querySelector("#a_1 > div > table");

  if (!table) {
    return data;
  }

  let labels = table.querySelectorAll(".mceGridLabel.siebui-label.mceLabel");
  labels.forEach((label) => {
    if (label && label.parentElement) {
      let key = label.textContent!.trim() as keyof VoltasServiceInfo;
      let next = label.parentElement.nextElementSibling;
      if (next) {
        let value;
        const inputEl = next.querySelector("input");
        if (inputEl) {
          value = inputEl.value.trim();
        }

        const textEl = next.querySelector("textarea");
        if (textEl) {
          value = textEl.value.trim();
        }

        if (value !== undefined) {
          data[key] = value;
        }
      }
    }
  });

  return data;
}

export default defineContentScript({
  matches: ["*://*.voltasworld.com/*"],
  allFrames: true,
  runAt: "document_end",
  main(ctx) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node: Node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.classList.contains("siebui-icon-upbgchecksr")) {
                insertCopyButton(element);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
