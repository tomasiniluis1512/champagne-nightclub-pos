// Data storage
let products = JSON.parse(localStorage.getItem('products') || '[]');
let chicas = JSON.parse(localStorage.getItem('chicas') || '[]');
let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
let config = JSON.parse(localStorage.getItem('config') || '{"companyName":"Inversiones JYL S.A.C.S","localName":"Night Club Champagne","paperWidth":58}');

function saveAll() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('chicas', JSON.stringify(chicas));
    localStorage.setItem('tickets', JSON.stringify(tickets));
    localStorage.setItem('config', JSON.stringify(config));
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'productos') renderProducts();
    if (id === 'chicas') renderChicas();
    if (id === 'historial') renderHistorial();
    if (id === 'contabilidad') renderAccounting();
    if (id === 'config') loadConfig();
    if (id === 'nueva') renderProductSelects();
}

// Products
function addProduct(e) {
    e.preventDefault();
    const name = document.getElementById('prodName').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    const ficha = parseFloat(document.getElementById('prodFicha').value) || 0;
    products.push({ id: Date.now(), name, price, ficha });
    saveAll();
    e.target.reset();
    renderProducts();
}

function renderProducts() {
    const div = document.getElementById('productsTable');
    if (!products.length) { div.innerHTML = '<p>No hay productos.</p>'; return; }
    let html = '<table><tr><th>Nombre</th><th>Precio</th><th>Ficha Def.</th><th>Acciones</th></tr>';
    products.forEach((p, i) => {
        html += `<tr>
            <td>${p.name}</td>
            <td>S/ ${p.price.toFixed(2)}</td>
            <td>S/ ${p.ficha.toFixed(2)}</td>
            <td><button onclick="editProduct(${i})">Editar</button> <button onclick="deleteProduct(${i})">Eliminar</button></td>
        </tr>`;
    });
    html += '</table>';
    div.innerHTML = html;
}

function editProduct(i) {
    const p = products[i];
    const name = prompt('Nombre:', p.name);
    const price = prompt('Precio:', p.price);
    const ficha = prompt('Ficha default:', p.ficha);
    if (name && price) {
        products[i] = { ...p, name, price: parseFloat(price), ficha: parseFloat(ficha) || 0 };
        saveAll();
        renderProducts();
    }
}

function deleteProduct(i) {
    if (confirm('Eliminar producto?')) {
        products.splice(i, 1);
        saveAll();
        renderProducts();
    }
}

// Chicas
function addChica(e) {
    e.preventDefault();
    const name = document.getElementById('chicaName').value.trim();
    chicas.push({ id: Date.now(), name });
    saveAll();
    e.target.reset();
    renderChicas();
}

function renderChicas() {
    const div = document.getElementById('chicasTable');
    if (!chicas.length) { div.innerHTML = '<p>No hay chicas registradas.</p>'; return; }
    let html = '<table><tr><th>Nombre</th><th>Acciones</th></tr>';
    chicas.forEach((c, i) => {
        html += `<tr><td>${c.name}</td><td><button onclick="deleteChica(${i})">Eliminar</button></td></tr>`;
    });
    html += '</table>';
    div.innerHTML = html;
}

function deleteChica(i) {
    if (confirm('Eliminar chica?')) {
        chicas.splice(i, 1);
        saveAll();
        renderChicas();
    }
}

// Nueva Boleta
let productRows = [];
let chicaRows = [];

function renderProductSelects() {
    // Initial one row
    document.getElementById('productList').innerHTML = '';
    productRows = [];
    addProductRow();
    document.getElementById('chicaList').innerHTML = '';
    chicaRows = [];
    updateFichaDivision();
}

function addProductRow() {
    const id = Date.now() + Math.random();
    productRows.push(id);
    const div = document.getElementById('productList');
    const row = document.createElement('div');
    row.className = 'row';
    row.id = 'prod-' + id;
    let options = '<option value="">Seleccionar...</option>';
    products.forEach(p => options += `<option value="${p.id}" data-price="${p.price}" data-ficha="${p.ficha}">${p.name} - S/${p.price}</option>`);
    row.innerHTML = `
        <select onchange="updateTotals()">${options}</select>
        <input type="number" value="1" min="1" onchange="updateTotals()" style="width:60px">
        <button onclick="this.parentElement.remove(); updateTotals()">X</button>
    `;
    div.appendChild(row);
}

function addChicaRow() {
    const id = Date.now() + Math.random();
    chicaRows.push(id);
    const div = document.getElementById('chicaList');
    const row = document.createElement('div');
    row.className = 'row';
    let options = '<option value="">Seleccionar chica...</option>';
    chicas.forEach(c => options += `<option value="${c.id}">${c.name}</option>`);
    row.innerHTML = `
        <select onchange="updateFichaDivision()">${options}</select>
        <button onclick="this.parentElement.remove(); updateFichaDivision()">X</button>
    `;
    div.appendChild(row);
    updateFichaDivision();
}

function updateFichaDivision() {
    const total = parseFloat(document.getElementById('fichaTotal').value) || 0;
    const selects = document.querySelectorAll('#chicaList select');
    const count = Array.from(selects).filter(s => s.value).length;
    const share = count > 0 ? (total / count).toFixed(2) : 0;
    document.getElementById('fichaDivision').textContent = count > 0 
        ? `Ficha dividida entre ${count} chica(s): S/ ${share} cada una` 
        : 'Agrega chicas para dividir la ficha';
}

function updateTotals() {
    // Could auto-sum ficha from products if wanted
    updateFichaDivision();
}

function createTicket() {
    const clientName = document.getElementById('clientName').value.trim() || 'Cliente';
    const items = [];
    let totalProducts = 0;
    document.querySelectorAll('#productList .row').forEach(row => {
        const select = row.querySelector('select');
        const qty = parseInt(row.querySelector('input').value) || 1;
        if (select.value) {
            const prod = products.find(p => p.id == select.value);
            if (prod) {
                const sub = prod.price * qty;
                items.push({ productId: prod.id, name: prod.name, qty, price: prod.price, subtotal: sub });
                totalProducts += sub;
            }
        }
    });
    if (!items.length) { alert('Agrega al menos un producto'); return; }

    const fichaTotal = parseFloat(document.getElementById('fichaTotal').value) || 0;
    const selectedChicas = [];
    const selects = document.querySelectorAll('#chicaList select');
    const validChicas = Array.from(selects).filter(s => s.value);
    const share = validChicas.length > 0 ? fichaTotal / validChicas.length : 0;
    validChicas.forEach(s => {
        const ch = chicas.find(c => c.id == s.value);
        if (ch) selectedChicas.push({ id: ch.id, name: ch.name, fichaShare: share });
    });

    const ticket = {
        id: Date.now(),
        date: new Date().toLocaleString('es-PE'),
        clientName,
        items,
        chicas: selectedChicas,
        totalProducts,
        totalFicha: fichaTotal,
        grandTotal: totalProducts + fichaTotal
    };
    tickets.push(ticket);
    saveAll();
    alert('Boleta creada! ID: ' + ticket.id);
    showPrintModal(ticket);
    // Reset form
    document.getElementById('clientName').value = '';
    document.getElementById('fichaTotal').value = '0';
    renderProductSelects();
}

// Print
let currentTicket = null;
function showPrintModal(ticket) {
    currentTicket = ticket;
    document.getElementById('printModal').style.display = 'flex';
    renderPrintPreview();
}

function renderPrintPreview() {
    if (!currentTicket) return;
    const include = document.getElementById('includeChicas').checked;
    const w = config.paperWidth || 58;
    document.documentElement.style.setProperty('--paper-width', w + 'mm');
    let html = `<div class="print-area">
        <h3 style="text-align:center;margin:0">${config.companyName}</h3>
        <p style="text-align:center;margin:0">${config.localName}</p>
        <p style="text-align:center;font-size:10px">Boleta de Venta</p>
        <p>Fecha: ${currentTicket.date}</p>
        <p>Cliente: ${currentTicket.clientName}</p>
        <hr>
        <table style="width:100%">
            <tr><th>Prod</th><th>Cant</th><th>P.U.</th><th>Sub</th></tr>`;
    currentTicket.items.forEach(it => {
        html += `<tr><td>${it.name}</td><td>${it.qty}</td><td>${it.price.toFixed(2)}</td><td>${it.subtotal.toFixed(2)}</td></tr>`;
    });
    html += `</table>
        <p><strong>Total Productos: S/ ${currentTicket.totalProducts.toFixed(2)}</strong></p>`;
    if (include && currentTicket.chicas.length) {
        html += `<hr><p><strong>Chicas / Fichas:</strong></p>`;
        currentTicket.chicas.forEach(ch => {
            html += `<p>${ch.name}: S/ ${ch.fichaShare.toFixed(2)}</p>`;
        });
        html += `<p>Total Fichas: S/ ${currentTicket.totalFicha.toFixed(2)}</p>`;
    }
    html += `<hr><p style="text-align:center">Gracias por su preferencia</p></div>`;
    document.getElementById('printPreview').innerHTML = html;
}

document.getElementById('includeChicas').addEventListener('change', renderPrintPreview);

function doPrint() {
    window.print();
}

function closeModal() {
    document.getElementById('printModal').style.display = 'none';
    currentTicket = null;
}

// Historial
function renderHistorial() {
    const div = document.getElementById('ticketsList');
    if (!tickets.length) { div.innerHTML = '<p>No hay boletas.</p>'; return; }
    let html = '<table><tr><th>Fecha</th><th>Cliente</th><th>Total Prod</th><th>Ficha</th><th>Chicas</th><th>Acciones</th></tr>';
    tickets.slice().reverse().forEach(t => {
        const chNames = t.chicas.map(c => c.name).join(', ') || '-';
        html += `<tr>
            <td>${t.date}</td>
            <td>${t.clientName}</td>
            <td>S/ ${t.totalProducts.toFixed(2)}</td>
            <td>S/ ${t.totalFicha.toFixed(2)}</td>
            <td>${chNames}</td>
            <td><button onclick="reprint(${t.id})">Reimprimir</button></td>
        </tr>`;
    });
    html += '</table>';
    div.innerHTML = html;
}

function reprint(id) {
    const t = tickets.find(tk => tk.id === id);
    if (t) showPrintModal(t);
}

// Contabilidad
function renderAccounting() {
    const div = document.getElementById('accounting');
    let totalSales = 0, totalFichas = 0;
    const byChica = {};
    tickets.forEach(t => {
        totalSales += t.totalProducts;
        totalFichas += t.totalFicha;
        t.chicas.forEach(ch => {
            byChica[ch.name] = (byChica[ch.name] || 0) + ch.fichaShare;
        });
    });
    let html = `<h3>Resumen</h3>
        <p>Total Ventas Productos: S/ ${totalSales.toFixed(2)}</p>
        <p>Total Fichas: S/ ${totalFichas.toFixed(2)}</p>
        <p>Gran Total: S/ ${(totalSales + totalFichas).toFixed(2)}</p>
        <h3>Fichas por Chica</h3><ul>`;
    for (const [name, amt] of Object.entries(byChica)) {
        html += `<li>${name}: S/ ${amt.toFixed(2)}</li>`;
    }
    html += '</ul>';
    div.innerHTML = html || '<p>No hay datos.</p>';
}

// Config
function loadConfig() {
    document.getElementById('companyName').value = config.companyName;
    document.getElementById('localName').value = config.localName;
    document.getElementById('paperWidth').value = config.paperWidth;
}

function saveConfig() {
    config.companyName = document.getElementById('companyName').value;
    config.localName = document.getElementById('localName').value;
    config.paperWidth = parseInt(document.getElementById('paperWidth').value) || 58;
    saveAll();
    alert('Configuración guardada');
}

// Init
window.onload = () => {
    showSection('nueva');
    // Sample data if empty
    if (!products.length) {
        products = [
            { id: 1, name: 'Jarra de Cerveza', price: 50, ficha: 20 },
            { id: 2, name: 'Whisky Botella', price: 150, ficha: 40 },
            { id: 3, name: 'Coctel', price: 30, ficha: 10 }
        ];
        saveAll();
    }
    if (!chicas.length) {
        chicas = [{ id: 1, name: 'Criss' }, { id: 2, name: 'Maria' }];
        saveAll();
    }
};