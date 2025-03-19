// Copy to clipboard function
export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

// Get the text from selector
export function getText(selector: string): string {
    return document.querySelector(selector)?.textContent || "";
}

// Get the text content of a node
export function getTextContent(node: Node | HTMLElement): string {
    return node.textContent || "";
}

export function copyServiceText({ brand, data }: ServiceInfoData): void {
    let callNo = "";
    let registeredPhoneNo = "";
    let alternatePhoneNo = "";
    let customerName = "";
    let address = "";
    let company = "";
    let product = "";
    let callType = "";
    let unitStatus = "";
    if (brand === "Voltas") {
        callNo = data["SR #"];
        registeredPhoneNo = data["Registered Phone"];
        alternatePhoneNo = data["Alternate Phone"];
        customerName = data["Account"];
        address = data["House #"] + ", " + data["Area"] + ", " + data["City"];
        company = "Voltas";
        product = data["Category"];
        callType = data["Call Type"];
        unitStatus = data["Unit Status"];
    } else if (brand === "Carrier") {
        callNo = data["Transaction No."];
        registeredPhoneNo = data["Registered Phone"];
        alternatePhoneNo = data["Alternate Phone"];
        customerName = data["Customer Name"];
        address = data["Installation Address"];
        company = data["Company"];
        product = data["Product Category"];
        callType = data["Service Type"];
        unitStatus = data["Coverage as per Customer"];
    } else if (brand === "Daikin") {
        callNo = data["Ticket ID"];
        registeredPhoneNo = data["Mobile"];
        alternatePhoneNo = data["Phone"];
        customerName = data["Customer"];
        let house = data["HouseID"];
        let street = data["Street"];
        let area = data["Area/Locality"];
        let landmark = data["Landmark"];
        let city = data["City"];
        address = `${house && `${house}, `}${street && `${street}, `}${
            area && `${area}, `
        }${landmark && `${landmark}, `}${city && `${city}`}`;
        company = "Daikin";
        product = data["Product Type"];
        callType = data["Call Type"];
        unitStatus = data["Coverage"];
    }

    company = BrandMap[company as keyof typeof BrandMap] || company;
    product = ProductMap[product as keyof typeof ProductMap] || product;
    callType = CallTypeMap[callType as keyof typeof CallTypeMap] || callType;
    unitStatus =
        UnitStatusMap[unitStatus as keyof typeof UnitStatusMap] || unitStatus;

    const text = `Call No ${callNo}\n\n${registeredPhoneNo}${
        alternatePhoneNo ? `, ${alternatePhoneNo}` : ""
    } - ${customerName}\n${address}\n\n${company} ${product} - ${callType} - ${unitStatus}`;

    copyToClipboard(text).then(() => {
        console.log("Copied to clipboard");
    });
}
