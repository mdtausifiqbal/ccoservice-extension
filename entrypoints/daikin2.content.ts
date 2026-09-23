import { copyServiceText, getText } from "@/utils/functions";

var ACTION_DIV_SELECTOR = "#__title13-_actionsToolbar-popover";
var POPOVER_SELECTOR = "#__title13-_actionsToolbar-popover-scroll";

function getServiceInfo(): DaikinCaseInfo {
  let form = document.querySelector("#__form0--Layout");

  const text = form?.textContent || "";

  const fields = [
    "Case Type",
    "Customer ID",
    "Customer Email ID",
    "Customer Name",
    "Customer Address",
    "Customer Mobile Number",
    "Ticket Description",
    "Reason for Escalation",
    "Escalation Status",
    "Appointment Start Date Time",
    "Reason for Scheduling",
    "Coverage",
  ];

  const escapedFields = fields
    .sort((a, b) => b.length - a.length)
    .map((field) => field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const regex = new RegExp(
    `(${escapedFields})(.*?)(?=${escapedFields}|$)`,
    "g",
  );

  let result: Record<string, string> = {};

  for (const match of text.matchAll(regex)) {
    const [, key, value] = match;

    result[key] = value.trim();
  }

  let ticketId = getText("#__title11-inner").substring(11);
  let caseType = result["Case Type"]
    .replace("RMS", "Service")
    .replace("Breakdown", "Not Cooling/Working");
  let customerName = result["Customer Name"];
  let customerAddress = result["Customer Address"]
    .replace(" / IN", "")
    .replaceAll(" / ", ", ");
  let customerMobile = result["Customer Mobile Number"].replace("+91", "");
  let unitStatus = result["Coverage"].replace("In Warranty", "Warranty");

  return {
    ticketId,
    caseType,
    customerName,
    customerAddress,
    customerMobile,
    unitStatus,
  } as DaikinCaseInfo;
}

function insertCopyButton(parentElement: Element) {
  let existingButton = parentElement.querySelector("#copyBtn");
  if (existingButton) return; // Button already exists, do not insert again

  const button = document.createElement("button");
  button.className = "sapMBtnBase sapMBtn sapMBtnInverted sapMBarChild";
  button.id = "copyBtn";

  const spanInner = document.createElement("span");
  spanInner.className =
    "sapMBtnInner sapMBtnHoverable sapMFocusable sapMBtnText sapMBtnEmphasized";

  const spanContent = document.createElement("span");
  spanContent.className = "sapMBtnContent";

  const bdi = document.createElement("bdi");
  bdi.textContent = "Copy";

  spanContent.appendChild(bdi);
  spanInner.appendChild(spanContent);
  button.appendChild(spanInner);
  parentElement.insertAdjacentElement("afterbegin", button);

  button.addEventListener("click", function () {
    copyServiceText({ brand: "DaikinV2", data: getServiceInfo() });
  });
}

function startObservationOnPopOver(parentElement: Element) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const element = mutation.target as HTMLElement;

        if (element.style.display === "block") {
          insertCopyButton(element);
        }
      }
    }
  });

  observer.observe(parentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });
}

function startObservation() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length === 0) return;
      mutation.addedNodes.forEach((node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;

          if (element.matches(ACTION_DIV_SELECTOR)) {
            let buttonDiv = element.querySelector(POPOVER_SELECTOR);
            if (!buttonDiv) return;
            insertCopyButton(buttonDiv);
            startObservationOnPopOver(buttonDiv);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
export default defineContentScript({
  matches: [
    "*://daikin-airconditioning-india-pvt--ltd--daikin-dev-ops-p3b4a81cd.cfapps.us10-001.hana.ondemand.com/*",
  ],
  runAt: "document_end",
  allFrames: true,
  main(ctx) {
    startObservation();
  },
});
