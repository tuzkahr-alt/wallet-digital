$(document).ready(function() {
  // ==========================================
  // 1. INICIALIZACIÓN DE ESTADO (LOCAL STORAGE)
  // ==========================================
  
  // Inicializar saldo por defecto si no existe
  if (localStorage.getItem('wallet_balance') === null) {
    localStorage.setItem('wallet_balance', '5000.00');
  }

  // Inicializar agenda de contactos por defecto si no existe
  var contactosDefault = [
    { nombre: "María López", cbu: "0170000011111111111111", alias: "maria.lopez" },
    { nombre: "Carlos Gómez", cbu: "0170000022222222222222", alias: "carlos.gomez" },
    { nombre: "Laura Rodríguez", cbu: "0170000033333333333333", alias: "laura.rod" }
  ];
  if (localStorage.getItem('wallet_contacts') === null) {
    localStorage.setItem('wallet_contacts', JSON.stringify(contactosDefault));
  }

  // Inicializar lista ficticia de transacciones por defecto si no existe
  var transaccionesDefault = [
    { fecha: "2026-06-20 14:32", tipo: "compra", detalle: "Supermercado Coto", monto: -1500.00 },
    { fecha: "2026-06-21 09:15", tipo: "deposito", detalle: "Depósito Inicial", monto: 5000.00 },
    { fecha: "2026-06-21 18:45", tipo: "recibido", detalle: "Transferencia de Juan Pérez", monto: 2000.00 }
  ];
  if (localStorage.getItem('listaTransacciones') === null) {
    localStorage.setItem('listaTransacciones', JSON.stringify(transaccionesDefault));
  }

  // ==========================================
  // FUNCIONES AUXILIARES DE ALERTA BOOTSTRAP
  // ==========================================
  function showBootstrapAlert(containerId, type, message) {
    var iconClass = "bi-info-circle";
    if (type === "success") iconClass = "bi-check-circle";
    if (type === "danger") iconClass = "bi-exclamation-triangle";
    
    var alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <i class="bi ${iconClass} mr-2"></i> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
    $(containerId).html(alertHtml);
  }

  // ==========================================
  // 2. PANTALLA DE LOGIN (index.html)
  // ==========================================
  if ($('#loginForm').length > 0) {
    $('#loginForm').submit(function(event) {
      event.preventDefault();
      
      // Uso de selectores jQuery recomendados
      var email = $('#email').val().trim();
      var password = $('#password').val();

      // Credenciales de prueba
      if (email === 'admin@bille.com' && password === '12345') {
        showBootstrapAlert('#alert-container', 'success', 'Inicio de sesión exitoso. Redirigiendo...');
        
        // Redirección jQuery solicitada
        setTimeout(function() {
          window.location.href = '../HTML/menu.html';
        }, 1000);
      } else {
        showBootstrapAlert('#alert-container', 'danger', 'Usuario o contraseña incorrectos. Inténtalo de nuevo.');
      }
    });
  }

  // ==========================================
  // 3. PANTALLA DE MENÚ PRINCIPAL (menu.html)
  // ==========================================
  if ($('#balance').length > 0 && window.location.pathname.includes('menu.html')) {
    // Cargar y mostrar saldo
    var currentBalance = parseFloat(localStorage.getItem('wallet_balance'));
    $('#balance').text(currentBalance.toFixed(2));

    // Agregar eventos con leyendas de redirección y funcionalidad
    $('#btnDeposit').click(function() {
      var btnText = $(this).text().trim();
      $('#redirect-legend-container').html(`
        <div class="redirect-legend">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <span>Redirigiendo a ${btnText.toLowerCase()}...</span>
        </div>
      `);
      
      setTimeout(function() {
        window.location.href = 'deposit.html';
      }, 1000);
    });

    $('#btnSendMoney').click(function() {
      var btnText = $(this).text().trim();
      $('#redirect-legend-container').html(`
        <div class="redirect-legend">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <span>Redirigiendo a ${btnText.toLowerCase()}...</span>
        </div>
      `);
      
      setTimeout(function() {
        window.location.href = 'sendmoney.html';
      }, 1000);
    });

    $('#btnTransactions').click(function() {
      var btnText = $(this).text().trim();
      $('#redirect-legend-container').html(`
        <div class="redirect-legend">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <span>Redirigiendo a ${btnText.toLowerCase()}...</span>
        </div>
      `);
      
      setTimeout(function() {
        window.location.href = 'transactions.html';
      }, 1000);
    });
  }

  // ==========================================
  // 4. PANTALLA DE DEPÓSITO (deposit.html)
  // ==========================================
  if ($('#depositForm').length > 0) {
    // Mostrar saldo actual desde Local Storage
    var currentBalance = parseFloat(localStorage.getItem('wallet_balance'));
    $('#balance').text(currentBalance.toFixed(2));

    $('#depositForm').submit(function(event) {
      event.preventDefault();
      
      var depositAmount = parseFloat($('#amount').val());
      
      if (!isNaN(depositAmount) && depositAmount > 0) {
        // Actualizar saldo
        var newBalance = currentBalance + depositAmount;
        localStorage.setItem('wallet_balance', newBalance.toFixed(2));
        $('#balance').text(newBalance.toFixed(2));
        
        // Agregar a transacciones
        var transacciones = JSON.parse(localStorage.getItem('listaTransacciones')) || [];
        var now = new Date();
        var fechaStr = now.getFullYear() + '-' + 
                       String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(now.getDate()).padStart(2, '0') + ' ' + 
                       String(now.getHours()).padStart(2, '0') + ':' + 
                       String(now.getMinutes()).padStart(2, '0');
        
        transacciones.unshift({
          fecha: fechaStr,
          tipo: "deposito",
          detalle: "Depósito Realizado",
          monto: depositAmount
        });
        localStorage.setItem('listaTransacciones', JSON.stringify(transacciones));

        // Agregar leyenda debajo del formulario con el monto depositado
        $('#deposit-legend-container').html(`
          <div class="deposit-legend">
            <i class="bi bi-wallet2 text-success-custom"></i> Monto depositado con éxito: $${depositAmount.toFixed(2)}
          </div>
        `);

        // Alerta de Bootstrap dinámica
        showBootstrapAlert('#alert-container', 'success', '¡Depósito realizado con éxito!');

        // Limpiar input
        $('#amount').val('');

        // Redirigir tras 2 segundos utilizando setTimeout
        setTimeout(function() {
          window.location.href = 'menu.html';
        }, 2000);
      } else {
        showBootstrapAlert('#alert-container', 'danger', 'Monto inválido. Por favor ingrese un número positivo.');
      }
    });
  }

  // ==========================================
  // 5. PANTALLA DE ENVIAR DINERO (sendmoney.html)
  // ==========================================
  if ($('#contactList').length > 0) {
    var selectedContact = null;

    // Renderizar contactos de Local Storage
    function renderContacts(filterText) {
      var contacts = JSON.parse(localStorage.getItem('wallet_contacts')) || [];
      var $list = $('#contactList');
      $list.empty();

      var term = filterText ? filterText.toLowerCase().trim() : '';

      contacts.forEach(function(c, index) {
        var match = !term || 
                    c.nombre.toLowerCase().includes(term) || 
                    c.cbu.toLowerCase().includes(term) || 
                    (c.alias && c.alias.toLowerCase().includes(term));

        if (match) {
          var itemHtml = `
            <li class="list-group-item" data-index="${index}" data-name="${c.nombre}">
              <div>
                <div class="contact-name"><i class="bi bi-person"></i> ${c.nombre}</div>
                <div class="contact-detail">Alias/CBU: ${c.alias || c.cbu}</div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </li>
          `;
          $list.append(itemHtml);
        }
      });

      if ($list.children().length === 0) {
        $list.append('<li class="list-group-item text-center text-muted">No se encontraron contactos.</li>');
      }
    }

    // Inicializar render de contactos
    renderContacts();

    // Mostrar y ocultar el formulario para agregar nuevos contactos
    $('#btnAddContact').click(function() {
      $('#addContactFormContainer').slideDown(300);
    });

    $('#btnCancelAddContact').click(function() {
      $('#addContactFormContainer').slideUp(300);
      $('#addContactForm')[0].reset();
    });

    // Validar y guardar el formulario de nuevo contacto
    $('#addContactForm').submit(function(event) {
      event.preventDefault();
      
      var name = $('#contactName').val().trim();
      var cbuOrAlias = $('#contactCbu').val().trim();

      // Validación de campos vacíos
      if (name === "" || cbuOrAlias === "") {
        showBootstrapAlert('#alert-container', 'danger', 'Por favor, completa todos los campos obligatorios.');
        return;
      }

      // Validar CBU (si es puramente numérico, debe tener exactamente 22 dígitos)
      var onlyNumbers = /^\d+$/;
      if (onlyNumbers.test(cbuOrAlias)) {
        if (cbuOrAlias.length !== 22) {
          showBootstrapAlert('#alert-container', 'danger', 'El CBU numérico debe tener exactamente 22 dígitos.');
          return;
        }
      }

      // Guardar contacto en Local Storage
      var contacts = JSON.parse(localStorage.getItem('wallet_contacts')) || [];
      
      // Determinar si es CBU o Alias
      var newContact = {
        nombre: name,
        cbu: cbuOrAlias,
        alias: onlyNumbers.test(cbuOrAlias) ? "" : cbuOrAlias
      };

      contacts.unshift(newContact);
      localStorage.setItem('wallet_contacts', JSON.stringify(contacts));

      // Limpiar y ocultar
      $('#addContactForm')[0].reset();
      $('#addContactFormContainer').slideUp(300);
      
      // Mostrar éxito y refrescar lista
      showBootstrapAlert('#alert-container', 'success', 'Contacto agregado correctamente a tu agenda.');
      renderContacts();
    });

    // Búsqueda interactiva en la agenda
    $('#searchContact').on('keyup', function() {
      renderContacts($(this).val());
      // Deseleccionar cualquier contacto al buscar
      selectedContact = null;
      $('.list-group-item').removeClass('selected');
      $('#sendMoneyFormContainer').slideUp(200);
    });

    $('#clearSearchBtn').click(function() {
      $('#searchContact').val('');
      renderContacts();
      selectedContact = null;
      $('#sendMoneyFormContainer').slideUp(200);
    });

    // Selección de contactos (Mostrar/ocultar el botón/formulario de Enviar dinero)
    $(document).on('click', '#contactList .list-group-item', function() {
      var index = $(this).data('index');
      if (index === undefined) return; // Si es el mensaje vacío

      if ($(this).hasClass('selected')) {
        // Deseleccionar
        $(this).removeClass('selected');
        selectedContact = null;
        $('#sendMoneyFormContainer').slideUp(300);
      } else {
        // Seleccionar
        $('#contactList .list-group-item').removeClass('selected');
        $(this).addClass('selected');
        selectedContact = {
          index: index,
          nombre: $(this).data('name')
        };
        // Mostrar formulario para ingresar el monto a enviar
        $('#sendMoneyFormContainer').slideDown(300);
      }
    });

    // Confirmación y envío de dinero
    $('#btnSendMoneyAction').click(function() {
      if (!selectedContact) {
        showBootstrapAlert('#alert-container', 'danger', 'Por favor, selecciona un contacto de la lista.');
        return;
      }

      var sendAmount = parseFloat($('#sendAmount').val());
      var currentBalance = parseFloat(localStorage.getItem('wallet_balance'));

      if (isNaN(sendAmount) || sendAmount <= 0) {
        showBootstrapAlert('#alert-container', 'danger', 'Monto inválido. Ingrese un valor positivo.');
        return;
      }

      if (sendAmount > currentBalance) {
        showBootstrapAlert('#alert-container', 'danger', 'Saldo insuficiente para realizar esta transferencia.');
        return;
      }

      // Restar del saldo
      var newBalance = currentBalance - sendAmount;
      localStorage.setItem('wallet_balance', newBalance.toFixed(2));

      // Agregar a la lista de transacciones
      var transacciones = JSON.parse(localStorage.getItem('listaTransacciones')) || [];
      var now = new Date();
      var fechaStr = now.getFullYear() + '-' + 
                     String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(now.getDate()).padStart(2, '0') + ' ' + 
                     String(now.getHours()).padStart(2, '0') + ':' + 
                     String(now.getMinutes()).padStart(2, '0');

      transacciones.unshift({
        fecha: fechaStr,
        tipo: "transferencia",
        detalle: "Transferencia a " + selectedContact.nombre,
        monto: -sendAmount
      });
      localStorage.setItem('listaTransacciones', JSON.stringify(transacciones));

      // Mostrar confirmación exitosa en la parte inferior
      $('#confirmation-container').html(`
        <div class="alert alert-success mt-3" style="animation: slideDown 0.3s ease;">
          <i class="bi bi-check2-all"></i> ¡Envío exitoso! Se transfirieron <strong>$${sendAmount.toFixed(2)}</strong> a <strong>${selectedContact.nombre}</strong>.
        </div>
      `);

      // Resetear inputs e interfaz
      $('#sendAmount').val('');
      $('#sendMoneyFormContainer').slideUp(300);
      $('.list-group-item').removeClass('selected');
      selectedContact = null;

      // Autolimpiar mensaje de éxito tras 5 segundos
      setTimeout(function() {
        $('#confirmation-container').empty();
      }, 5000);
    });
  }

  // ==========================================
  // 6. PANTALLA DE ÚLTIMOS MOVIMIENTOS (transactions.html)
  // ==========================================
  if ($('#transactionListBody').length > 0) {
    
    // Función para renderizar transacciones
    window.mostrarUltimosMovimientos = function(filtro) {
      var transacciones = JSON.parse(localStorage.getItem('listaTransacciones')) || [];
      var $tbody = $('#transactionListBody');
      $tbody.empty();

      var transaccionesFiltradas = transacciones.filter(function(t) {
        if (!filtro || filtro === 'todas') return true;
        return t.tipo === filtro;
      });

      if (transaccionesFiltradas.length === 0) {
        $('#noTransactionsMessage').show();
        $('.table-responsive').hide();
      } else {
        $('#noTransactionsMessage').hide();
        $('.table-responsive').show();

        transaccionesFiltradas.forEach(function(t) {
          var amountClass = t.monto >= 0 ? "text-success-custom" : "text-danger-custom";
          var amountPrefix = t.monto >= 0 ? "+" : "";
          var badgeClass = "";
          
          if (t.tipo === "deposito") badgeClass = "badge-deposit";
          else if (t.tipo === "transferencia") badgeClass = "badge-send";
          else if (t.tipo === "compra") badgeClass = "badge-purchase";
          else if (t.tipo === "recibido") badgeClass = "badge-deposit";

          var rowHtml = `
            <tr>
              <td class="text-muted">${t.fecha}</td>
              <td>
                <span class="badge-transaction ${badgeClass}">${getTipoTransaccion(t.tipo)}</span>
                <span class="d-block mt-1 font-weight-normal">${t.detalle}</span>
              </td>
              <td class="text-right ${amountClass} font-weight-bold">
                ${amountPrefix}$${Math.abs(t.monto).toFixed(2)}
              </td>
            </tr>
          `;
          $tbody.append(rowHtml);
        });
      }
    };

    // Función getTipoTransaccion recomendada en consignas
    window.getTipoTransaccion = function(tipo) {
      switch (tipo) {
        case 'deposito':
          return 'Depósito';
        case 'transferencia':
          return 'Transferencia Enviada';
        case 'compra':
          return 'Compra';
        case 'recibido':
          return 'Transferencia Recibida';
        default:
          return tipo;
      }
    };

    // Escuchar cambios en el selector de filtros
    $('#filterType').change(function() {
      mostrarUltimosMovimientos($(this).val());
    });

    // Botón para limpiar historial
    $('#clearHistoryBtn').click(function() {
      if (confirm('¿Estás seguro de que deseas limpiar el historial de movimientos?')) {
        localStorage.setItem('listaTransacciones', JSON.stringify([]));
        mostrarUltimosMovimientos($('#filterType').val());
      }
    });

    // Renderizado inicial
    mostrarUltimosMovimientos('todas');
  }
});
