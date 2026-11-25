// Data storage
let products = JSON.parse(localStorage.getItem('products') || '[]');
let chicas = JSON.parse(localStorage.getItem('chicas') || '[]');
let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
let config = JSON.parse(localStorage.getItem('config') || '{
  "companyName":"Inversiones JYL S.A.C.S",
  "ruc":"20615614999",
  "address":"Jr. Yavari 1781",
  "localName":"",
  "serie":"B001",
  "nextNumber":1,
  "paperWidth":58
}');

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
    let html = '<table><tr><th>Nombre</th><th>Precio</th><th>Ficha / unidad</th><th>Acciones</th></tr>';
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
    const ficha = prompt('Ficha por unidad:', p.ficha);
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
function renderProductSelects() {
    document.getElementById('productList').innerHTML = '';
    addProductRow();
    updateFichaSummary();
}

function addProductRow() {
    const div = document.getElementById('productList');
    const row = document.createElement('div');
    row.className = 'product-row';
    row.style.cssText = 'background:#2a2a2a; padding:12px; margin:8px 0; border-radius:6px;';

    let prodOptions = '<option value="">Seleccionar producto...</option>';
    products.forEach(p => {
        prodOptions += `<option value="${p.id}" data-price="${p.price}" data-ficha="${p.ficha}">${p.name} - S/${p.price} (ficha S/${p.ficha})</option>`;
    });

    let chicaCheckboxes = '';
    if (chicas.length === 0) {
        chicaCheckboxes = '<em style="color:#888">No hay chicas registradas. Ve a la pestaña Chicas.</em>';
    } else {
        chicas.forEach(c => {
            chicaCheckboxes += `<label style="margin-right:12px; font-size:14px;"><input type="checkbox" value="${c.id}" data-name="${c.name}" onchange="updateFichaSummary()"> ${c.name}</label>`;
        });
    }

    row.innerHTML = `
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:8px;">
            <select style="flex:2; min-width:180px;" onchange="updateFichaSummary()">${prodOptions}</select>
            <input type="number" value="1" min="1" style="width:70px;" onchange="updateFichaSummary()" title="Cantidad">
            <button type="button" onclick="this.closest('.product-row').remove(); updateFichaSummary()">X</button>
        </div>
        <div style="font-size:13px;">
            <strong>Ficha de este producto para:</strong> (marca una o varias, o ninguna = solo cliente)<br>
            ${chicaCheckboxes}
        </div>
    `;
    div.appendChild(row);
    updateFichaSummary();
}

function updateFichaSummary() {
    const summary = document.getElementById('fichaSummary');
    let totalProducts = 0;
    let totalFichaAssigned = 0;
    const byChica = {};

    document.querySelectorAll('#productList .product-row').forEach(row => {
        const select = row.querySelector('select');
        const qtyInput = row.querySelector('input[type="number"]');
        if (!select || !select.value) return;

        const prod = products.find(p => p.id == select.value);
        if (!prod) return;

        const qty = parseInt(qtyInput.value) || 1;
        const sub = prod.price * qty;
        totalProducts += sub;

        const fichaItem = prod.ficha * qty;
        const checked = Array.from(row.querySelectorAll('input[type="checkbox"]:checked'));
        if (checked.length > 0) {
            const share = fichaItem / checked.length;
            totalFichaAssigned += fichaItem;
            checked.forEach(cb => {
                const name = cb.dataset.name;
                byChica[name] = (byChica[name] || 0) + share;
            });
        }
    });

    let html = `<strong>Resumen de esta boleta:</strong><br>
        Total productos: S/ ${totalProducts.toFixed(2)}<br>
        Total fichas asignadas a chicas: S/ ${totalFichaAssigned.toFixed(2)}`;
    if (Object.keys(byChica).length) {
        html += '<br><small>';
        for (const [name, amt] of Object.entries(byChica)) {
            html += `${name}: S/ ${amt.toFixed(2)} &nbsp; `;
        }
        html += '</small>';
    }
    summary.innerHTML = html;
}

function createTicket() {
    const clientName = document.getElementById('clientName').value.trim() || 'Cliente';
    const items = [];
    let totalProducts = 0;
    let totalFicha = 0;
    const chicaTotals = {};

    const rows = document.querySelectorAll('#productList .product-row');
    if (rows.length === 0) { alert('Agrega al menos un producto'); return; }

    rows.forEach(row => {
        const select = row.querySelector('select');
        const qtyInput = row.querySelector('input[type="number"]');
        if (!select || !select.value) return;

        const prod = products.find(p => p.id == select.value);
        if (!prod) return;

        const qty = parseInt(qtyInput.value) || 1;
        const sub = prod.price * qty;
        const fichaItem = prod.ficha * qty;

        const assigned = [];
        const checked = Array.from(row.querySelectorAll('input[type="checkbox"]:checked'));
        if (checked.length > 0) {
            const share = fichaItem / checked.length;
            totalFicha += fichaItem;
            checked.forEach(cb => {
                const name = cb.dataset.name;
                const id = cb.value;
                assigned.push({ id, name, share });
                chicaTotals[name] = (chicaTotals[name] || 0) + share;
            });
        }

        items.push({
            productId: prod.id,
            name: prod.name,
            qty,
            price: prod.price,
            subtotal: sub,
            fichaPerUnit: prod.ficha,
            fichaTotal: fichaItem,
            assignedChicas: assigned
        });
        totalProducts += sub;
    });

    if (items.length === 0) { alert('Agrega al menos un producto válido'); return; }

    const chicasSummary = Object.entries(chicaTotals).map(([name, fichaShare]) => ({
        name,
        fichaShare
    }));

    // Generate correlative number
    const numero = config.nextNumber || 1;
    const serie = config.serie || 'B001';
    const numeroCompleto = serie + '-' + String(numero).padStart(8, '0');

    const ticket = {
        id: Date.now(),
        serie,
        numero,
        numeroCompleto,
        date: new Date().toLocaleString('es-PE'),
        clientName,
        items,
        chicas: chicasSummary,
        totalProducts,
        totalFicha,
        igv: 0,
        grandTotal: totalProducts + totalFicha
    };

    tickets.push(ticket);
    config.nextNumber = numero + 1;
    saveAll();
    alert('Boleta creada! ' + numeroCompleto);
    showPrintModal(ticket);

    document.getElementById('clientName').value = '';
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

    const company = config.companyName || 'Inversiones JYL S.A.C.S';
    const ruc = config.ruc || '20615614999';
    const address = config.address || 'Jr. Yavari 1781';
    const local = config.localName && config.localName.trim() ? config.localName.trim() : '';

    let html = `<div class="print-area">
        <p style="text-align:center;margin:0;font-weight:bold;">${company}</p>
        <p style="text-align:center;margin:0;">RUC: ${ruc}</p>
        <p style="text-align:center;margin:0;font-size:11px;">${address}</p>`;
    if (local) {
        html += `<p style="text-align:center;margin:0;">${local}</p>`;
    }
    html += `<p style="text-align:center;margin:4px 0;font-weight:bold;">BOLETA DE VENTA</p>
        <p style="text-align:center;margin:0;">${currentTicket.numeroCompleto || 'B001-00000001'}</p>
        <p>Fecha: ${currentTicket.date}</p>
        <p>Cliente: ${currentTicket.clientName}</p>
        <hr>
        <table style="width:100%;font-size:11px;">
            <tr><th>Cant</th><th>Descripción</th><th>P.U.</th><th>Importe</th></tr>`;
    currentTicket.items.forEach(it => {
        html += `<tr><td>${it.qty}</td><td>${it.name}</td><td>${it.price.toFixed(2)}</td><td>${it.subtotal.toFixed(2)}</td></tr>`;
    });
    html += `</table>
        <hr>
        <p>OP. EXONERADAS: S/ ${currentTicket.totalProducts.toFixed(2)}</p>
        <p>IGV: S/ 0.00</p>
        <p><strong>IMPORTE TOTAL: S/ ${currentTicket.totalProducts.toFixed(2)}</strong></p>`;

    if (include && currentTicket.chicas && currentTicket.chicas.length) {
        html += `<hr><p><strong>Chicas / Fichas (control interno):</strong></p>`;
        currentTicket.chicas.forEach(ch => {
            html += `<p>${ch.name}: S/ ${ch.fichaShare.toFixed(2)}</p>`;
        });
        html += `<p>Total Fichas: S/ ${currentTicket.totalFicha.toFixed(2)}</p>`;
    }
    html += `<hr><p style="text-align:center;font-size:10px;">Gracias por su preferencia</p>
        </div>`;
    document.getElementById('printPreview').innerHTML = html;
}

if (!window._printListenerAdded) {
    document.getElementById('includeChicas').addEventListener('change', renderPrintPreview);
    window._printListenerAdded = true;
}

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
    let html = '<table><tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Ficha</th><th>Chicas</th><th>Acciones</th></tr>';
    tickets.slice().reverse().forEach(t => {
        const chNames = t.chicas.map(c => c.name).join(', ') || '-';
        html += `<tr>
            <td>${t.numeroCompleto || t.id}</td>
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
        <p>Total Ventas Productos (exonerado): S/ ${totalSales.toFixed(2)}</p>
        <p>Total Fichas asignadas a chicas: S/ ${totalFichas.toFixed(2)}</p>
        <p>Gran Total: S/ ${(totalSales + totalFichas).toFixed(2)}</p>
        <h3>Fichas por Chica</h3>`;
    if (Object.keys(byChica).length === 0) {
        html += '<p>Aún no hay fichas registradas.</p>';
    } else {
        html += '<ul>';
        for (const [name, amt] of Object.entries(byChica)) {
            html += `<li>${name}: S/ ${amt.toFixed(2)}</li>`;
        }
        html += '</ul>';
    }
    div.innerHTML = html;
}

// Excel / CSV Export
function downloadCSV(filename, rows) {
    const csvContent = rows.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportHistorialExcel() {
    if (!tickets.length) { alert('No hay boletas para exportar'); return; }
    const rows = [
        ['Número', 'Fecha', 'Cliente', 'Total Productos', 'Total Ficha', 'Gran Total', 'Chicas']
    ];
    tickets.forEach(t => {
        const chNames = t.chicas.map(c => `${c.name} (S/${c.fichaShare.toFixed(2)})`).join(' | ') || '-';
        rows.push([
            t.numeroCompleto || t.id,
            t.date,
            t.clientName,
            t.totalProducts.toFixed(2),
            t.totalFicha.toFixed(2),
            (t.totalProducts + t.totalFicha).toFixed(2),
            chNames
        ]);
    });
    downloadCSV('historial_boletas.csv', rows);
}

function exportContabilidadExcel() {
    let totalSales = 0, totalFichas = 0;
    const byChica = {};
    tickets.forEach(t => {
        totalSales += t.totalProducts;
        totalFichas += t.totalFicha;
        t.chicas.forEach(ch => {
            byChica[ch.name] = (byChica[ch.name] || 0) + ch.fichaShare;
        });
    });

    const rows = [
        ['Concepto', 'Monto'],
        ['Total Ventas Productos (Exonerado)', totalSales.toFixed(2)],
        ['Total Fichas', totalFichas.toFixed(2)],
        ['Gran Total', (totalSales + totalFichas).toFixed(2)],
        [''],
        ['Chica', 'Total Ficha']
    ];
    for (const [name, amt] of Object.entries(byChica)) {
        rows.push([name, amt.toFixed(2)]);
    }
    downloadCSV('contabilidad.csv', rows);
}

// Config
function loadConfig() {
    document.getElementById('companyName').value = config.companyName || 'Inversiones JYL S.A.C.S';
    document.getElementById('ruc').value = config.ruc || '20615614999';
    document.getElementById('address').value = config.address || 'Jr. Yavari 1781';
    document.getElementById('localName').value = config.localName || '';
    document.getElementById('serie').value = config.serie || 'B001';
    document.getElementById('nextNumber').value = config.nextNumber || 1;
    document.getElementById('paperWidth').value = config.paperWidth || 58;
}

function saveConfig() {
    config.companyName = document.getElementById('companyName').value;
    config.ruc = document.getElementById('ruc').value;
    config.address = document.getElementById('address').value;
    config.localName = document.getElementById('localName').value;
    config.serie = document.getElementById('serie').value || 'B001';
    config.nextNumber = parseInt(document.getElementById('nextNumber').value) || 1;
    config.paperWidth = parseInt(document.getElementById('paperWidth').value) || 58;
    saveAll();
    alert('Configuración guardada');
}

// Init
window.onload = () => {
    if (!config.ruc) config.ruc = '20615614999';
    if (!config.address) config.address = 'Jr. Yavari 1781';
    if (config.localName === undefined) config.localName = '';
    if (!config.serie) config.serie = 'B001';
    if (!config.nextNumber) config.nextNumber = 1;
    showSection('nueva');
    if (!products.length) {
        products = [
            { id: 1, name: 'Jarra de Cerveza', price: 50, ficha: 20 },
            { id: 2, name: 'Agua', price: 5, ficha: 0 },
            { id: 3, name: 'Whisky Botella', price: 150, ficha: 40 },
            { id: 4, name: 'Coctel', price: 30, ficha: 10 }
        ];
        saveAll();
    }
    if (!chicas.length) {
        chicas = [{ id: 1, name: 'Criss' }, { id: 2, name: 'Maria' }];
        saveAll();
    }
};