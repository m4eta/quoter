document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const calculationMethodSelect = document.getElementById('calculationMethod');
    const baseFeeInput = document.getElementById('baseFee');
    const ratePerUnitInput = document.getElementById('ratePerUnit');
    const ratePerUnitLabel = document.getElementById('ratePerUnitLabel');
    // const currencySymbolInput = document.getElementById('currencySymbolInput'); // REMOVED
    const extraServicesSettingsDiv = document.getElementById('extraServicesSettings');
    const addNewExtraServiceBtn = document.getElementById('addNewExtraServiceBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const settingsMessage = document.getElementById('settingsMessage');

    const lawnInputsContainer = document.getElementById('lawnInputsContainer');
    const addLawnBtn = document.getElementById('addLawnBtn');

    const extraServicesCheckboxesDiv = document.getElementById('extraServicesCheckboxes');
    const calculateBtn = document.getElementById('calculateBtn');

    const quoteDisplayPanel = document.getElementById('quoteDisplayPanel');
    const quoteBreakdownDiv = document.getElementById('quoteBreakdown');
    const quoteTotalAmountSpan = document.getElementById('quoteTotalAmount');
    const downloadQuoteBtn = document.getElementById('downloadQuoteBtn');

    // Modal Elements
    const customizeQuoteLink = document.getElementById('customizeQuoteLink');
    const customizationModal = document.getElementById('customizationModal');
    const closeCustomizationModalBtn = document.getElementById('closeCustomizationModalBtn');
    const quoteTitleInput = document.getElementById('quoteTitle');
    const companyNameInput = document.getElementById('companyName');
    const companyLogoInput = document.getElementById('companyLogo');
    const logoPreviewImg = document.getElementById('logoPreview');
    const removeLogoBtn = document.getElementById('removeLogoBtn');
    const companyAddressInput = document.getElementById('companyAddress');
    const companyContactInput = document.getElementById('companyContact');
    const quoteFooterNotesInput = document.getElementById('quoteFooterNotes');
    const customerNameInput = document.getElementById('customerNameInput');
    const customerAddressInput = document.getElementById('customerAddressInput');
    const saveCustomizationBtn = document.getElementById('saveCustomizationBtn');
    const customizationMessage = document.getElementById('customizationMessage');

    // Report Elements
    const reportContainer = document.getElementById('reportContainer');
    const reportLogoImg = document.getElementById('reportLogo');
    const reportCompanyName = document.getElementById('reportCompanyName');
    const reportCompanyAddress = document.getElementById('reportCompanyAddress');
    const reportCompanyContact = document.getElementById('reportCompanyContact');
    const reportMainTitle = document.getElementById('reportMainTitle');
    const reportCustomerName = document.getElementById('reportCustomerName');
    const reportCustomerAddress = document.getElementById('reportCustomerAddress');
    const reportDate = document.getElementById('reportDate');
    const reportBaseFeeLine = document.getElementById('reportBaseFeeLine'); 
    const reportLawnDetails = document.getElementById('reportLawnDetails');
    const reportUnitChargeLabel = document.getElementById('reportUnitChargeLabel');
    const reportTotalUnitValue = document.getElementById('reportTotalUnitValue');
    const reportUnitMeasurement = document.getElementById('reportUnitMeasurement');
    const reportRatePerUnitText = document.getElementById('reportRatePerUnitText');
    const reportUnitType = document.getElementById('reportUnitType');
    const reportUnitChargeTotalValue = document.getElementById('reportUnitChargeTotalValue');
    const reportMowingSubtotalLine = document.getElementById('reportMowingSubtotalLine'); 
    const reportExtraServicesSection = document.getElementById('reportExtraServicesSection');
    const reportExtraServicesListUl = document.getElementById('reportExtraServicesList');
    const reportTotalAmountText = document.getElementById('reportTotalAmountText');
    const reportFooterNotes = document.getElementById('reportFooterNotes');

    const initialDefaultServices = [
        { id: 'edging_default', name: 'Edging', price: 15.00 },
        { id: 'weed_spraying_default', name: 'Lawn Weed Spraying', price: 25.00 },
        { id: 'fertilizer_default', name: 'Lawn Fertilizer', price: 30.00 },
    ];

    let appSettings = {
        calculationMethod: 'perimeter',
        baseFee: 25.00,
        ratePerUnit: 0.75,
        // currencySymbol: '$', // REMOVED - hardcoded to $
        services: [] 
    };
    const SETTINGS_STORAGE_KEY = 'lawnMowerAppSettings_v3';

    let quoteCustomization = {
        quoteTitle: "Lawn Service Quote",
        companyName: "Your Company Name",
        companyLogoBase64: null,
        companyAddress: "123 Main St, Anytown, USA 12345",
        companyContact: "Phone: 555-0100 | info@example.com",
        quoteFooterNotes: "Payment due upon receipt. Thank you for your business!",
    };
    const CUSTOMIZATION_STORAGE_KEY = 'lawnMowerQuoteCustomization';

    function updateLabelsAndPlaceholders(method) { 
        const currency = '$'; // Hardcoded to $
        let placeholderTextForNewRows = "";
        let unitSuffixForNewRows = "";

        if (method === 'perimeter') {
            placeholderTextForNewRows = "Perimeter (m)";
            unitSuffixForNewRows = "m";
            ratePerUnitLabel.innerHTML = `Rate Per Meter (<span class="currency-symbol">${currency}</span>):`;
        } else { // area
            placeholderTextForNewRows = "Area (m²)";
            unitSuffixForNewRows = "m²";
            ratePerUnitLabel.innerHTML = `Rate Per Sq. Meter (<span class="currency-symbol">${currency}</span>):`;
        }
        document.querySelectorAll('.lawn-unit-input').forEach(input => { input.placeholder = placeholderTextForNewRows;});
        document.querySelectorAll('.unit-label-suffix').forEach(span => { span.textContent = unitSuffixForNewRows;});
        // No need to call updateCurrencySymbolInUI as it's removed and $ is hardcoded
        document.querySelectorAll('.currency-symbol').forEach(span => { span.textContent = '$'; }); // Ensure all are $
    }

    calculationMethodSelect.addEventListener('change', (e) => {
        appSettings.calculationMethod = e.target.value;
        updateLabelsAndPlaceholders(appSettings.calculationMethod);
    });

    // updateCurrencySymbolInUI function REMOVED

    function populateExtraServicesSettings() { 
        extraServicesSettingsDiv.innerHTML = '';
        if (!appSettings.services || appSettings.services.length === 0) {
            extraServicesSettingsDiv.innerHTML = '<p class="subtle-text">No extra services defined. Click "Add New" to create one.</p>';
        }
        appSettings.services.forEach(service => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'service-price-group';
            groupDiv.setAttribute('data-service-id', service.id);
            
            groupDiv.innerHTML = `
                <input type="text" class="service-name-input" value="${service.name}" placeholder="Service Name">
                <div class="price-input-group">
                    <span class="currency-symbol">$</span>
                    <input type="number" class="service-price-input" value="${service.price.toFixed(2)}" step="0.01" min="0">
                </div>
                <button type="button" class="remove-service-btn btn-icon btn-danger-subtle" data-service-id="${service.id}">×</button>
            `;
            extraServicesSettingsDiv.appendChild(groupDiv);
        });
        // Ensure currency symbols within this section are also updated (if any were missed by general selector)
        extraServicesSettingsDiv.querySelectorAll('.currency-symbol').forEach(span => { span.textContent = '$'; });
    }

    function populateExtraServicesCheckboxes() { 
        extraServicesCheckboxesDiv.innerHTML = '';
        if (!appSettings.services || appSettings.services.length === 0) {
            extraServicesCheckboxesDiv.innerHTML = '<p class="subtle-text">No extra services available.</p>';
            return;
        }
        appSettings.services.forEach(service => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'service-checkbox-group';
            groupDiv.innerHTML = `<input type="checkbox" id="check-${service.id}" data-service-id="${service.id}"> <label for="check-${service.id}">${service.name} ($${service.price.toFixed(2)})</label>`;
            extraServicesCheckboxesDiv.appendChild(groupDiv);
        });
    }

    function loadSettings() { 
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
            const loaded = JSON.parse(storedSettings);
            Object.assign(appSettings, loaded);
            if (!Array.isArray(appSettings.services)) {
                appSettings.services = JSON.parse(JSON.stringify(initialDefaultServices));
            }
        } else {
            appSettings.services = JSON.parse(JSON.stringify(initialDefaultServices));
        }
        
        calculationMethodSelect.value = appSettings.calculationMethod;
        baseFeeInput.value = appSettings.baseFee.toFixed(2);
        ratePerUnitInput.value = appSettings.ratePerUnit.toFixed(2);
        // currencySymbolInput.value = appSettings.currencySymbol; // REMOVED
        
        updateLabelsAndPlaceholders(appSettings.calculationMethod);
        populateExtraServicesSettings();
        populateExtraServicesCheckboxes();
    }

    function saveSettings() { 
        try {
            appSettings.calculationMethod = calculationMethodSelect.value;
            appSettings.baseFee = parseFloat(baseFeeInput.value);
            appSettings.ratePerUnit = parseFloat(ratePerUnitInput.value);
            // const newCurrencySymbol = currencySymbolInput.value.trim(); // REMOVED

            if (isNaN(appSettings.baseFee) || appSettings.baseFee < 0 || isNaN(appSettings.ratePerUnit) || appSettings.ratePerUnit < 0) { 
                throw new Error("Base fee and rate must be valid non-negative numbers."); 
            }
            // if (!newCurrencySymbol) { // REMOVED
            //     throw new Error("Currency symbol cannot be empty."); 
            // }
            // appSettings.currencySymbol = newCurrencySymbol; // REMOVED

            const updatedServices = [];
            const serviceSettingRows = extraServicesSettingsDiv.querySelectorAll('.service-price-group');
            serviceSettingRows.forEach(row => {
                const id = row.getAttribute('data-service-id');
                const nameInput = row.querySelector('.service-name-input');
                const priceInput = row.querySelector('.service-price-input');
                
                const name = nameInput.value.trim();
                const price = parseFloat(priceInput.value);

                if (!name) throw new Error(`Service name cannot be empty for service ID ${id}.`);
                if (isNaN(price) || price < 0) throw new Error(`Invalid price for service "${name}". Price must be a non-negative number.`);

                updatedServices.push({ id, name, price });
            });
            appSettings.services = updatedServices;

            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(appSettings));
            settingsMessage.textContent = 'Settings saved successfully!'; 
            settingsMessage.className = 'message success';
            
            updateLabelsAndPlaceholders(appSettings.calculationMethod);
            populateExtraServicesSettings();
            populateExtraServicesCheckboxes();

        } catch (error) { 
            settingsMessage.textContent = `Error: ${error.message}`; 
            settingsMessage.className = 'message error'; 
        }
        setTimeout(() => { settingsMessage.textContent = ''; settingsMessage.className = 'message'; }, 4000);
    }

    function addNewExtraService() {
        const newService = {
            id: 'service_' + Date.now(),
            name: 'New Service',
            price: 0.00
        };
        appSettings.services.push(newService);
        populateExtraServicesSettings();
        populateExtraServicesCheckboxes();
    }

    addNewExtraServiceBtn.addEventListener('click', addNewExtraService);

    extraServicesSettingsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-service-btn')) {
            const serviceIdToRemove = event.target.getAttribute('data-service-id');
            appSettings.services = appSettings.services.filter(service => service.id !== serviceIdToRemove);
            populateExtraServicesSettings();
            populateExtraServicesCheckboxes();
        }
    });

    function openCustomizationModal() {
        quoteTitleInput.value = quoteCustomization.quoteTitle;
        companyNameInput.value = quoteCustomization.companyName;
        companyAddressInput.value = quoteCustomization.companyAddress;
        companyContactInput.value = quoteCustomization.companyContact;
        quoteFooterNotesInput.value = quoteCustomization.quoteFooterNotes;
        customerNameInput.value = window.currentQuoteDetails?.customerName || '';
        customerAddressInput.value = window.currentQuoteDetails?.customerAddress || '';

        if (quoteCustomization.companyLogoBase64) {
            logoPreviewImg.src = quoteCustomization.companyLogoBase64;
            logoPreviewImg.style.display = 'block';
            removeLogoBtn.style.display = 'inline-block';
        } else {
            logoPreviewImg.style.display = 'none';
            removeLogoBtn.style.display = 'none';
            companyLogoInput.value = ''; 
        }
        customizationModal.style.display = "flex";
    }
    function closeCustomizationModal() {
        customizationModal.style.display = "none";
        customizationMessage.textContent = ''; customizationMessage.className = 'message';
    }
    customizeQuoteLink.addEventListener('click', (e) => { e.preventDefault(); openCustomizationModal(); });
    closeCustomizationModalBtn.addEventListener('click', closeCustomizationModal);
    window.addEventListener('click', (event) => { 
        if (event.target == customizationModal) { closeCustomizationModal(); }
    });
    companyLogoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { 
                alert("Logo file is too large. Max 1MB allowed.");
                companyLogoInput.value = ''; 
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                logoPreviewImg.src = e.target.result;
                logoPreviewImg.style.display = 'block';
                removeLogoBtn.style.display = 'inline-block';
            }
            reader.readAsDataURL(file);
        }
    });
    removeLogoBtn.addEventListener('click', () => {
        quoteCustomization.companyLogoBase64 = null;
        logoPreviewImg.src = '#';
        logoPreviewImg.style.display = 'none';
        removeLogoBtn.style.display = 'none';
        companyLogoInput.value = ''; 
    });
    function saveQuoteCustomization() {
        quoteCustomization.quoteTitle = quoteTitleInput.value.trim() || "Service Quote";
        quoteCustomization.companyName = companyNameInput.value.trim() || "Your Company";
        if (logoPreviewImg.style.display !== 'none' && logoPreviewImg.src !== '#' && logoPreviewImg.src !== quoteCustomization.companyLogoBase64) {
             quoteCustomization.companyLogoBase64 = logoPreviewImg.src; 
        } else if (logoPreviewImg.style.display === 'none') {
            quoteCustomization.companyLogoBase64 = null; 
        }
        quoteCustomization.companyAddress = companyAddressInput.value.trim();
        quoteCustomization.companyContact = companyContactInput.value.trim();
        quoteCustomization.quoteFooterNotes = quoteFooterNotesInput.value.trim();
        if (window.currentQuoteDetails) {
            window.currentQuoteDetails.customerName = customerNameInput.value.trim();
            window.currentQuoteDetails.customerAddress = customerAddressInput.value.trim();
        }
        localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(quoteCustomization));
        customizationMessage.textContent = "Customization saved!";
        customizationMessage.className = "message success";
        setTimeout(() => {
            customizationMessage.textContent = ''; customizationMessage.className = 'message';
            closeCustomizationModal();
        }, 2000);
    }
    saveCustomizationBtn.addEventListener('click', saveQuoteCustomization);
    function loadQuoteCustomization() {
        const stored = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
        if (stored) {
            const loadedCustomization = JSON.parse(stored);
            Object.keys(quoteCustomization).forEach(key => {
                if (loadedCustomization[key] !== undefined) {
                    quoteCustomization[key] = loadedCustomization[key];
                }
            });
        }
    }

    let lawnIdCounter = 0;
    function createLawnInputRow(id = lawnIdCounter++) { 
        const row = document.createElement('div');
        row.className = 'lawn-input-row';
        row.setAttribute('data-lawn-id', id);
        const currentMethod = appSettings.calculationMethod;
        const placeholderText = currentMethod === 'perimeter' ? "Perimeter (m)" : "Area (m²)";
        const unitSuffix = currentMethod === 'perimeter' ? "m" : "m²";
        row.innerHTML = `
            <input type="text" class="lawn-description" placeholder="Lawn Description (e.g., Front Yard)" value="Lawn Area ${id + 1}"> 
            <div class="unit-input-wrapper">
                <input type="number" class="lawn-unit-input" placeholder="${placeholderText}" min="1"> 
                <span class="unit-label-suffix">${unitSuffix}</span> 
            </div>
            <button type="button" class="remove-lawn-btn btn-icon">×</button>`;
        lawnInputsContainer.appendChild(row);
        row.querySelector('.remove-lawn-btn').addEventListener('click', () => { row.remove(); updateRemoveButtonStates(); });
        updateRemoveButtonStates();
        return row;
    }
    function updateRemoveButtonStates() { 
        const rows = lawnInputsContainer.querySelectorAll('.lawn-input-row');
        rows.forEach((row, index) => { const removeBtn = row.querySelector('.remove-lawn-btn'); if (removeBtn) { removeBtn.disabled = rows.length <= 1; } });
    }
    addLawnBtn.addEventListener('click', () => {
        createLawnInputRow();
        updateLabelsAndPlaceholders(appSettings.calculationMethod);
    });

    function calculateQuote() { 
        const lawnRows = lawnInputsContainer.querySelectorAll('.lawn-input-row');
        let totalUnitValue = 0; const lawnData = []; let isValid = true;
        lawnRows.forEach(row => {
            const description = row.querySelector('.lawn-description').value.trim() || "Unnamed Lawn";
            const unitValue = parseFloat(row.querySelector('.lawn-unit-input').value);
            if (isNaN(unitValue) || unitValue <= 0) { isValid = false; }
            lawnData.push({ description, unitValue }); totalUnitValue += unitValue;
        });
        if (!isValid || lawnData.length === 0 || (totalUnitValue <= 0 && lawnData.length > 0)) {
            alert("Please enter valid positive values for all lawn areas.");
            quoteDisplayPanel.style.display = 'none'; return;
        }

        let breakdownHTML = ''; let totalQuote = 0;
        const currentMethod = appSettings.calculationMethod;
        const unitLabel = currentMethod === 'perimeter' ? "m" : "m²";
        const rateTypeLabel = currentMethod === 'perimeter' ? "Meter" : "Sq. Meter";
        const calculationTypeString = currentMethod === 'perimeter' ? "Perimeter" : "Area";

        const mowingBaseCost = appSettings.baseFee; totalQuote += mowingBaseCost;
        breakdownHTML += `<div class="quote-line-item"><span class="item-label">Base Fee:</span> <span class="item-value">$${mowingBaseCost.toFixed(2)}</span></div>`;
        
        breakdownHTML += `<h4 class="quote-subsection-title">Lawn Mowing (by ${calculationTypeString})</h4>`;
        let totalUnitBasedCharge = 0;
        lawnData.forEach(lawn => {
            const unitBasedCharge = lawn.unitValue * appSettings.ratePerUnit; totalUnitBasedCharge += unitBasedCharge;
            breakdownHTML += `<div class="quote-line-item sub-item"><span class="item-label"><em>${lawn.description}</em> (${lawn.unitValue}${unitLabel} @ $${appSettings.ratePerUnit.toFixed(2)}/${rateTypeLabel.toLowerCase()}):</span> <span class="item-value">$${unitBasedCharge.toFixed(2)}</span></div>`;
        });
        totalQuote += totalUnitBasedCharge;
        breakdownHTML += `<div class="quote-line-item section-subtotal"><span class="item-label">Total ${calculationTypeString} Based Charge:</span> <span class="item-value">$${totalUnitBasedCharge.toFixed(2)}</span></div>`;
        const mowingSubtotal = mowingBaseCost + totalUnitBasedCharge;
        breakdownHTML += `<div class="quote-line-item section-total"><span class="item-label">Mowing Subtotal:</span> <span class="item-value">$${mowingSubtotal.toFixed(2)}</span></div>`;

        let extraServicesCost = 0; const selectedServicesData = []; 
        let extraServicesBreakdownHTML = '';
        appSettings.services.forEach(service => {
            const checkbox = document.getElementById(`check-${service.id}`);
            if (checkbox && checkbox.checked) {
                extraServicesCost += service.price; 
                selectedServicesData.push({ name: service.name, price: service.price });
                extraServicesBreakdownHTML += `<div class="quote-line-item sub-item"><span class="item-label">${service.name}:</span> <span class="item-value">$${service.price.toFixed(2)}</span></div>`;
            }
        });
        if (selectedServicesData.length > 0) {
            totalQuote += extraServicesCost;
            breakdownHTML += `<h4 class="quote-subsection-title">Additional Services</h4>${extraServicesBreakdownHTML}`;
            breakdownHTML += `<div class="quote-line-item section-total"><span class="item-label">Additional Services Subtotal:</span> <span class="item-value">$${extraServicesCost.toFixed(2)}</span></div>`;
        }

        quoteBreakdownDiv.innerHTML = breakdownHTML;
        quoteTotalAmountSpan.textContent = `$${totalQuote.toFixed(2)}`;
        quoteDisplayPanel.style.display = 'block';
        quoteDisplayPanel.scrollIntoView({ behavior: 'smooth' });

        window.currentQuoteDetails = {
            calculationMethod: currentMethod, lawns: lawnData, totalUnitValue: totalUnitValue,
            unitLabel: unitLabel, rateTypeLabel: rateTypeLabel, baseFee: mowingBaseCost,
            ratePerUnit: appSettings.ratePerUnit, totalUnitBasedCharge: totalUnitBasedCharge,
            mowingSubtotal: mowingSubtotal, 
            selectedServices: selectedServicesData,
            extraServicesTotal: extraServicesCost,
            totalAmount: totalQuote, currencySymbol: '$', // Hardcoded
            date: new Date().toLocaleDateString(),
            customerName: customerNameInput.value.trim(), 
            customerAddress: customerAddressInput.value.trim() 
        };
    }

    function populateReportForPNG() {
        if (!window.currentQuoteDetails) return;
        const q = window.currentQuoteDetails;
        const c = quoteCustomization; 

        reportMainTitle.textContent = c.quoteTitle;
        reportCompanyName.textContent = c.companyName || "Your Company Name"; 
        if (c.companyLogoBase64) {
            reportLogoImg.src = c.companyLogoBase64;
            reportLogoImg.style.display = 'block';
        } else { reportLogoImg.style.display = 'none'; }
        reportCompanyAddress.textContent = c.companyAddress;
        reportCompanyContact.textContent = c.companyContact;
        reportFooterNotes.textContent = c.quoteFooterNotes;

        if (q.customerName) {
            reportCustomerName.textContent = q.customerName;
            reportCustomerName.parentElement.style.display = 'block'; 
        } else { reportCustomerName.parentElement.style.display = 'none'; }
        reportCustomerAddress.textContent = q.customerAddress || '';
        reportDate.textContent = q.date;
        reportBaseFeeLine.innerHTML = `<span>Base Fee:</span> <span>$${q.baseFee.toFixed(2)}</span>`;
        reportLawnDetails.innerHTML = '';
        q.lawns.forEach(lawn => {
            const lawnItemDiv = document.createElement('div'); lawnItemDiv.className = 'report-lawn-item';
            const unitBasedCost = lawn.unitValue * q.ratePerUnit;
            lawnItemDiv.innerHTML = `<p><span><em>${lawn.description}</em> (${lawn.unitValue}${q.unitLabel}):</span> <span>$${unitBasedCost.toFixed(2)}</span></p>`;
            reportLawnDetails.appendChild(lawnItemDiv);
        });
        reportUnitChargeLabel.textContent = `Total ${q.calculationMethod === 'perimeter' ? 'Perimeter' : 'Area'} Charge`;
        reportTotalUnitValue.textContent = q.totalUnitValue.toFixed(2);
        reportUnitMeasurement.textContent = q.unitLabel;
        reportRatePerUnitText.textContent = `$${q.ratePerUnit.toFixed(2)}`;
        reportUnitType.textContent = q.calculationMethod === 'perimeter' ? 'meter' : 'sq. meter';
        reportUnitChargeTotalValue.textContent = `$${q.totalUnitBasedCharge.toFixed(2)}`;
        reportMowingSubtotalLine.innerHTML = `<span><strong>Subtotal (Mowing):</strong></span> <span><strong>$${q.mowingSubtotal.toFixed(2)}</strong></span>`;
        reportExtraServicesListUl.innerHTML = '';
        if (q.selectedServices.length > 0) {
            reportExtraServicesSection.style.display = 'block';
            q.selectedServices.forEach(service => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${service.name}</span> <span>$${service.price.toFixed(2)}</span>`;
                reportExtraServicesListUl.appendChild(li);
            });
        } else { reportExtraServicesSection.style.display = 'none'; }
        reportTotalAmountText.textContent = `$${q.totalAmount.toFixed(2)}`;
    }
    async function downloadQuoteAsPNG() { 
        if (!window.currentQuoteDetails) { alert("Please generate a quote first."); return; }
        populateReportForPNG();
        reportContainer.style.display = 'block'; reportContainer.style.position = 'absolute';
        reportContainer.style.left = '-9999px'; reportContainer.style.top = '-9999px'; 
        try {
            const canvas = await html2canvas(reportContainer, { 
                scale: 2, useCORS: true, logging: false,
                width: reportContainer.scrollWidth, height: reportContainer.scrollHeight 
            });
            reportContainer.style.display = 'none'; reportContainer.style.position = '';
            reportContainer.style.left = ''; reportContainer.style.top = '';
            const imageURL = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a'); downloadLink.href = imageURL;
            downloadLink.download = `quote_${censorFileName(window.currentQuoteDetails.customerName || 'service')}_${Date.now()}.png`; 
            document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink);
        } catch (error) {
            console.error('Error generating PNG:', error);
            alert('Sorry, an error occurred while generating the report PNG.');
            reportContainer.style.display = 'none'; reportContainer.style.position = '';
            reportContainer.style.left = ''; reportContainer.style.top = '';
        }
    }
    function censorFileName(name) { 
        return name.replace(/[^a-z0-9_.-]/gi, '_').substring(0, 50);
    }

    saveSettingsBtn.addEventListener('click', saveSettings);
    calculateBtn.addEventListener('click', calculateQuote);
    downloadQuoteBtn.addEventListener('click', downloadQuoteAsPNG);

    loadSettings();
    loadQuoteCustomization(); 
    createLawnInputRow();
    updateLabelsAndPlaceholders(appSettings.calculationMethod); 
});