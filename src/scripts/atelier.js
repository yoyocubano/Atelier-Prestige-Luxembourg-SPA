import { db } from '../firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const serviceEl = document.getElementById('calc-service');
const unitsEl = document.getElementById('calc-units');
const resultEl = document.getElementById('calc-result');
const deliveryRadios = document.getElementsByName('delivery');
const bookBtn = document.getElementById('calc-book-btn');

const toast = document.getElementById('toast-notification');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

function showToast(title, message, isError = false) {
  toastTitle.innerText = title.toUpperCase();
  toastMessage.innerText = message;

  if (isError) {
    toastIcon.innerText = 'error';
    toastIcon.className = 'material-symbols-outlined text-error';
    toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
  } else {
    toastIcon.innerText = 'verified';
    toastIcon.className = 'material-symbols-outlined text-primary';
    toast.style.borderColor = 'rgba(212, 175, 55, 0.4)';
  }

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  toast.style.pointerEvents = 'auto';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
  }, 6000);
}

function sanitizeInput(value, maxLength = 300) {
  return String(value || '').trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

let calculatedTotal = '50.00';

function getSelectedServiceText() {
  return serviceEl.options[serviceEl.selectedIndex].text;
}

function getSelectedUnitsText() {
  return unitsEl.options[unitsEl.selectedIndex].text;
}

function getSelectedDeliveryText() {
  let deliveryText = 'Standard';

  deliveryRadios.forEach((radio) => {
    if (radio.checked && parseFloat(radio.value) > 0) {
      deliveryText = 'Express 24h (+30€)';
    }
  });

  return deliveryText;
}

function calculate() {
  const basePrice = parseFloat(serviceEl.value);
  const multiplier = parseFloat(unitsEl.value);
  let deliveryFee = 0;

  deliveryRadios.forEach((radio) => {
    if (radio.checked) {
      deliveryFee = parseFloat(radio.value);
    }
  });

  const total = basePrice * multiplier + deliveryFee;
  calculatedTotal = total.toFixed(2);
  resultEl.innerText = calculatedTotal;
}

[serviceEl, unitsEl].forEach((el) => el.addEventListener('change', calculate));
deliveryRadios.forEach((radio) => radio.addEventListener('change', calculate));

if (bookBtn) {
  bookBtn.addEventListener('click', async () => {
    const serviceName = getSelectedServiceText();
    const unitsName = getSelectedUnitsText();
    const deliveryName = getSelectedDeliveryText();
    const prefillMessage = `Bonjour,\n\nJe souhaite réserver un créneau de consultation privée pour le projet suivant :\n- Service : ${serviceName}\n- Quantité : ${unitsName}\n- Livraison : ${deliveryName}\n- Estimation budgétaire : ${calculatedTotal} € HT\n\nMerci de me recontacter pour valider la faisabilité technique.`;

    document.getElementById('contact-description').value = prefillMessage;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('contact-name').focus();

    showToast('Option Sélectionnée', "Les détails de l'estimateur ont été importés dans le formulaire.", false);

    try {
      await addDoc(collection(db, 'estimates'), {
        serviceValue: sanitizeInput(serviceEl.value, 60),
        quantityValue: sanitizeInput(unitsEl.value, 60),
        deliveryValue: sanitizeInput(getSelectedDeliveryText(), 120),
        calculatedTotal,
        timestamp: serverTimestamp(),
        source: 'web',
      });
    } catch (err) {
      console.error('[Estimate save failed]', err);
    }
  });
}

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit-btn');

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitOriginalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
    TRAITEMENT EN COURS...
  `;

  const name = sanitizeInput(document.getElementById('contact-name').value, 120);
  const email = sanitizeInput(document.getElementById('contact-email').value, 180);
  const company = sanitizeInput(document.getElementById('contact-company').value, 160);
  const projectDescription = sanitizeInput(document.getElementById('contact-description').value, 5000);

  if (!name || !email || !projectDescription || !isValidEmail(email)) {
    showToast('Validation impossible', 'Veuillez renseigner un nom, un email valide et une description.', true);
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitOriginalText;
    return;
  }

  const whatsappConsent = document.getElementById('contact-whatsapp-consent').checked;
  const serviceName = getSelectedServiceText();
  const subject = encodeURIComponent(`Demande Atelier Prestige - ${serviceName}`);
  const emailBody = encodeURIComponent(
    `Bonjour Atelier Prestige,\n\nJe souhaite soumettre une demande de personnalisation.\n\nNom : ${name}\nEmail : ${email}\nEntreprise / Événement : ${company || 'Particulier'}\nService : ${serviceName}\nEstimation : ${calculatedTotal} € HT\n\nDétails du projet :\n${projectDescription}\n\nMerci de me recontacter.`,
  );

  try {
    await addDoc(collection(db, 'contacts'), {
      name,
      email,
      company,
      projectDescription,
      serviceName: sanitizeInput(serviceName, 120),
      calculatedTotal,
      timestamp: serverTimestamp(),
      source: 'web',
    });
  } catch (err) {
    console.error('[Contact save failed]', err);
  }

  const mailUrl = `mailto:contact@atelierprestige.lu?subject=${subject}&body=${emailBody}`;
  window.location.href = mailUrl;
  showToast('Client Email Ouvert & Demande Enregistrée', 'Votre message a été préparé et enregistré.', false);

  if (whatsappConsent) {
    const waNumber = '352621430283';
    const waText = encodeURIComponent(
      `Bonjour Atelier Prestige !\n\nJe souhaite soumettre ma demande de personnalisation :\n\nNom : ${name}\nEmail : ${email}\nEntreprise : ${company || 'Particulier'}\nService : ${serviceName}\nEstimation : ${calculatedTotal} € HT\n\nDétails du projet :\n${projectDescription}\n\nMerci de me recontacter !`,
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

    submitBtn.classList.remove('bg-primary', 'text-on-primary-fixed');
    submitBtn.classList.add('bg-[#25D366]', 'text-white');
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined text-white mr-2">chat</span>
      ENVOYER DIRECTEMENT PAR WHATSAPP
    `;
    submitBtn.disabled = false;

    submitBtn.onclick = (clickEvent) => {
      clickEvent.preventDefault();
      window.open(waUrl, '_blank', 'noopener');

      setTimeout(() => {
        submitBtn.className =
          'gold-shine group px-16 py-5 bg-primary text-on-primary-fixed font-label-caps text-label-caps tracking-widest hover:scale-105 transition-all duration-300 flex items-center gap-3';
        submitBtn.innerHTML = submitOriginalText;
        submitBtn.onclick = null;
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    };

    return;
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = submitOriginalText;
  contactForm.reset();
});

calculate();
