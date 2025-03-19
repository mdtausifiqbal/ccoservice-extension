import { copyServiceText } from "@/utils/functions";

function insertCopyButton(element: Element) {
    let copyBtn = document.createElement("button");
    copyBtn.innerHTML = "Copy";
    copyBtn.style.marginLeft = "20px";
    copyBtn.addEventListener("click", function () {
        copyServiceText({ brand: "Carrier", data: getServiceInfo() });
    });

    element.insertAdjacentElement("afterend", copyBtn);
}

function getServiceInfo(): CMIServiceInfo {
    let data = {
        "Allocated Eng.[Code]": "",
        "Call Completion Date": "",
        "Call Logged By": "",
        "Call Logged Date": "",
        "Call Source": "",
        "Call Status": "",
        Company: "",
        "Coverage as per Customer": "",
        "Customer Classification": "",
        "Customer Name": "",
        "Customer RelationShip ID": "",
        "Customer Relationship with CMI": "",
        "Customer Remarks": "",
        "Document Upload": "",
        "Engineer Allocation Remarks": "",
        "FSR Scanned Copy": "",
        "Incident No.": "",
        "Installation Address": "",
        "Is Repeat Repair": "",
        "Last Modified At": "",
        "Last Modified By": "",
        Model: "",
        "Overall rating": "",
        "Pending Reason": "",
        "Pre-Approved Amount": "",
        "Pre-Approved Item Cost": "",
        "Pre-Approved Labor Cost": "",
        "Previous Call No": "",
        "Product Category": "",
        "Product Coverage": "",
        "Re-Seller Name": "",
        "Reason for Std TAT violation": "",
        "Scheduled At": "",
        "Serial No.": "",
        "Service Completion Date ": "",
        "Service Coverage": "",
        "Service Location": "",
        "Service Outcome": "",
        "Service Outcome Remarks": "",
        "Service Requester Mobile No": "",
        "Service Status": "",
        "Service Sub Type": "",
        "Service Type": "",
        "Std TAT": "",
        "Tech Rating": "",
        "Transaction No.": "",
        "Registered Phone": "",
        "Alternate Phone": "",
    };

    let table = document.querySelector(
        "#_785DHTMLWindowLarge > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(4) > td > table"
    );

    if (!table) {
        return data;
    }

    let rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
        let td1 = row.querySelector("td:nth-child(1)");
        let td2 = row.querySelector("td:nth-child(2)");

        if (td1?.innerHTML.includes("table")) return;

        let key = td1?.textContent as keyof CMIServiceInfo;
        let value = td2?.textContent as string;

        if (value === undefined) return;

        data[key] = value;
    });

    let phone: string[] = [];
    let phoneEl = document.querySelector(
        "#_785DHTMLWindowLarge > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(9) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)"
    );
    if (phoneEl) {
        phone = phoneEl.innerHTML.split("<br>");
        let registeredPhoneNo =
            phone.length > 0 ? phone[0].replace("+91-", "") : "";
        let alternatePhoneNo =
            phone.length > 1 ? phone[1].substring(1, 11) : "";
        data["Registered Phone"] = registeredPhoneNo;
        data["Alternate Phone"] = alternatePhoneNo;
    }

    let address = data["Installation Address"];
    data["Installation Address"] = address.substring(0, address.indexOf("["));

    return data;
}

export default defineContentScript({
    matches: ["*://*.cmiservice.co.in/*"],
    allFrames: true,
    runAt: "document_end",
    main(ctx) {
        const targetNode = document.querySelector("#_785DHTMLWindowLarge");

        // Now add mutation observer to targetNode if content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    // if node type of HTMLElement
                    let parent = node as HTMLElement;
                    let fontNode = parent.querySelector(
                        "tbody > tr:nth-child(1) > td > font"
                    );

                    if (fontNode) {
                        insertCopyButton(fontNode);
                    }
                });
            });
        });

        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
            });
        }
    },
});
