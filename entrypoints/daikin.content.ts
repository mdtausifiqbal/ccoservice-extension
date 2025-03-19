import { copyServiceText } from "@/utils/functions";

var PARENT_QUERY_SELECTOR =
    ".sapMPage.sapMPageBgStandard.sapMPageWithFooter.sapClientMODPage.sapClientMPage.sapClientMNewActionPlacement.sapClientMFooterHidden.sapClientMAddPageLevelOverflow";
var RIGHT_BTN_BAR_QUERY_SELECTOR =
    ".sapMIBar.sapMTB.sapMTBNewFlex.sapMTBInactive.sapMTBStandard.sapMTB-Auto-CTX";

function getServiceInfo(): DaikinServiceInfo {
    let els = document.querySelectorAll(
        ".sapClientBaseControlsSimpleVLayout.sapClientMFormElement"
    );
    let labels = Array.from(els).map((el) => {
        let label = el.firstChild?.textContent?.trim();
        let value = el.lastChild?.textContent?.trim();
        if (label && (label === value || value === "-")) {
            return [label, ""];
        } else {
            return [label, value];
        }
    });
    // Now covert nested array to object
    let data = Object.fromEntries(labels);
    let ticketId = data["Ticket ID"];
    data["Ticket ID"] = ticketId.slice(-8);
    let mobile = data["Mobile"];
    data["Mobile"] = mobile.replace("+91 ", "");
    let phone = data["Phone"];
    data["Phone"] = phone.replace("+91 ", "");
    return data as DaikinServiceInfo;
}

function insertCopyButton(parentElement: Element, childElement: Element) {
    const button = document.createElement("button");
    button.className = "sapMBtnBase sapMBtn width-button-form sapMBarChild";
    button.id = "copyBtn";

    const spanInner = document.createElement("span");
    spanInner.className = "sapMBtnInner sapMBtnText sapMBtnDefault";

    const spanContent = document.createElement("span");
    spanContent.className = "sapMBtnContent";
    spanContent.textContent = "Copy";

    // Append spans inside button
    spanInner.appendChild(spanContent);
    button.appendChild(spanInner);

    button.addEventListener("click", function () {
        copyServiceText({ brand: "Daikin", data: getServiceInfo() });
    });

    if (parentElement && childElement) {
        observeButtonRemoval(parentElement);
        childElement.appendChild(button);
    }
}

function observeButtonRemoval(target: Element = document.body) {
    const observer = new MutationObserver(() => {
        const parentElement = document.querySelector(PARENT_QUERY_SELECTOR);
        const childElement = parentElement?.querySelector(
            RIGHT_BTN_BAR_QUERY_SELECTOR
        );
        const copyBtn = childElement?.querySelector("#copyBtn");

        if (parentElement && childElement && !copyBtn) {
            insertCopyButton(parentElement, childElement); // Reinsert if removed
        }
    });

    observer.observe(target, {
        childList: true,
        subtree: true,
    });
}

function startObservation() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length === 0) return;
            mutation.addedNodes.forEach((node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (element.matches(PARENT_QUERY_SELECTOR)) {
                        let rightBtnBar = element.querySelector(
                            RIGHT_BTN_BAR_QUERY_SELECTOR
                        );
                        if (rightBtnBar) {
                            insertCopyButton(element, rightBtnBar);
                        }
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
    matches: ["*://my327035.crm.ondemand.com/sap/ap/ui/*"],
    runAt: "document_end",
    main(ctx) {
        startObservation();
        // observeAtInterval();
    },
});
