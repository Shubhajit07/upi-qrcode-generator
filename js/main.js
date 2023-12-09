const form = document.getElementById('form');
const qrCodeContainer = document.getElementById('qr-code-image');

const params = new URLSearchParams(window.location.search);
const vpaQuery = params.get('pa');
const amountQuery = params.get('am');
const nameQuery = params.get('pn');
const remarksQuery = params.get('tn');

const storedUPIId = localStorage.getItem('upiId');
const storedName = localStorage.getItem('name');

if (storedUPIId) {
    document.getElementById('upi-id').value = storedUPIId;
}
if (storedName) {
    document.getElementById('name').value = storedName;
}

if (vpaQuery) {
    form.style.display = 'none';
    const upiId = vpaQuery;
    const amount = amountQuery || '';
    const remarks = remarksQuery || '';
    const uname = nameQuery || '';

    generateQrCode(getQrCodeContent(uname, upiId, amount, remarks));
}

function saveToLocalStorage(upiId, name) {
    localStorage.setItem('upiId', upiId);
    localStorage.setItem('name', name);
}

function getUrlSuffix(name, upiId, amount, remarks) {
    let params = `pa=${upiId}`;

    if (name) {
        params += `&pn=${name}`;
    }
    if (amount) {
        params += `&am=${amount}`;
    }
    if (remarks) {
        params += `&tn=${remarks}`;
    }

    return encodeURI(params);
}

function getQrCodeContent(name, upiId, amount, remarks) {
    return upiId ? `upi://pay?${getUrlSuffix(name, upiId, amount, remarks)}` : '';
}

function generateQrCode(value) {
    qrCodeContainer.innerHTML = '';
    new QRCode(qrCodeContainer, {
        text: value,
        width: 256,
        height: 256,
    });
}

function showPaymentLink() {
    const checkbox = document.getElementById('show-plink');
    const uname = document.getElementById('name').value;
    const upiId = document.getElementById('upi-id').value;
    const amount = document.getElementById('amount').value;
    const remarks = document.getElementById('remarks').value;

    const plinkContainer = document.getElementById('plink-container');
    const plinkElement = document.getElementById('plink');

    if (checkbox.checked) {
        plinkContainer.style.display = 'block';
        plinkElement.value = window.location.href + '?' + getUrlSuffix(uname, upiId, amount, remarks);
    } else {
        plinkContainer.style.display = 'none';
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const uname = document.getElementById('name').value;
    const upiId = document.getElementById('upi-id').value;
    const amount = document.getElementById('amount').value;
    const remarks = document.getElementById('remarks').value;
    const content = getQrCodeContent(uname, upiId, amount, remarks);

    if (content) {
        generateQrCode(content);
        saveToLocalStorage(upiId, uname);
    }
}

document.getElementById('qr-form').addEventListener('submit', handleFormSubmit);
