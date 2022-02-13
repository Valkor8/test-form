'use stirct';

const form = document.querySelector('#form');
const inn = form.querySelector('.inn');
const innError = form.querySelector('#inn-error');
const checkbox = form.querySelector('.form__checkbox-indicator');
const residence = form.querySelector('.residence');
const radioResidence = Array.from(form.querySelectorAll('.form__radio-residence .form__radio-indicator'));
const residenceError = form.querySelector('#residenceError');
const radioPublic = Array.from(form.querySelectorAll('.public .form__radio-indicator'));
const formButton = form.querySelector('.form__continue-btn');
const formMomey = form.querySelector('.form__money');
const moneyError = form.querySelector('#moneyError');
const residenceInvalid = form.querySelector('#residence-error');
const yesNoError = form.querySelector('.form__yes-no-error');
const yesNoError2 = form.querySelector('.form__yes-no-error-2');

const LENGTH = 12;
const MAX_LENGTH = 12;

const innValidity = () => {
  innError.style.display='none';
  if (inn.value.length !== LENGTH) {
    inn.setCustomValidity(`Значение поля ИНН должно быть равно ${LENGTH} символам`);
  } else if (inn.validity.valueMissing) {
    if (!checkbox.checked) {
      inn.setCustomValidity('Поле обязательно для заполнения');
    }
  } else {
    inn.setCustomValidity('');
  }

  inn.reportValidity();
}

inn.addEventListener('input', innValidity);

const checkboxClickHandler = () => {
  if (checkbox.checked) {
    inn.value = '';
    inn.setAttribute('disabled', 'disabled');
    inn.removeEventListener('input', innValidity);
    innError.style.display='none';
  } else {
    inn.removeAttribute('disabled');
    inn.addEventListener('input', innValidity);
  }
};

checkbox.addEventListener('change', checkboxClickHandler);

const innDisabled = () => {
  inn.value = '';
  inn.setAttribute('disabled', 'disabled');
  inn.removeEventListener('input', innValidity);
  checkbox.removeEventListener('change', checkboxClickHandler);
  checkbox.setAttribute('disabled', 'disabled');
  residenceInvalid.style.display='inline';
}

const innEnabled = () => {
  if (!checkbox.checked) {
    inn.removeAttribute('disabled');
    inn.addEventListener('input', innValidity);
  }
  checkbox.addEventListener('change', checkboxClickHandler);
  checkbox.removeAttribute('disabled');
  residenceInvalid.style.display='none';
}

radioResidence.forEach((item) => {
  item.addEventListener('click', (evt) => {
    if (evt.target.dataset.id === 'yes') {
      innDisabled();
      residence.value = 'USA';
      yesNoError.style.display="none";
      residenceError.style.display="none";
      innError.style.display='none';
    } else {
      innEnabled();
      if (residence.value === 'USA') {
        residence.value = '';
      }
      yesNoError.style.display="none";
    }
  });
});

radioPublic.forEach((item) => {
  item.addEventListener('click', (evt) => {
    if (evt.target.dataset.id === 'yes' || evt.target.dataset.id === 'no') {
      yesNoError2.style.display="none";
    }
  });
});

const isRadioResidenceValid = () => {
  let isValid = false;
  radioResidence.forEach((item) => {
    if (item.checked) {
      isValid = true;
      yesNoError.style.display="none";
    }
  });
  if (!isValid) {
    yesNoError.style.display="inline";
  }
  return isValid
}

const isRadioPublicValid = () => {
  let isValid = false;
  radioPublic.forEach((item) => {
    if (item.checked) {
      isValid = true;
    }
  });
  if (!isValid) {
    yesNoError2.style.display="inline";
  }
  return isValid
}

const isInnValid = () => {
  if (checkbox.checked) {
    inn.setCustomValidity('');
    console.log(inn.validity.valid)
    return;
  }
  if (inn.value === '') {
    innError.textContent = `Поле обязательно для заполнения`
    innError.style.display='inline';
  } else if (inn.value < 100000000000 || inn.value > 999999999999) {
    innError.textContent = `ИНН должен состоять из 12 символов`
    innError.style.display='inline';
  }
}

const isResidenceValid = () => {
  if (residence.value === '') {
    residenceError.style.display="inline";
  } else {
    residenceError.style.display="none";
  }
};

const isMoneyValid = () => {
  if (formMomey.value === '') {
    moneyError.style.display="inline";
  } else {
    moneyError.style.display="none";
  }
};

residence.addEventListener('change', (evt) => {
  residenceError.style.display="none";

  if (evt.target.value === 'USA') {
    innDisabled();
    radioResidence.forEach((item) => item.dataset.id === 'yes'? item.checked = true : item.checked = false);
  } else {
    innEnabled();
    radioResidence.forEach((item) => item.checked = false);
  }
});

formMomey.addEventListener('change', () => {
  moneyError.style.display="none";
});

formButton.addEventListener('click', (evt) => {
  evt.preventDefault();

  isInnValid();

  isRadioResidenceValid();

  isResidenceValid();

  isMoneyValid();

  if (!isRadioPublicValid()) {
    return
  }

  if (inn.validity.valid === false || residence.validity.valid === false || formMomey.validity.valid === false) {
    return
  }

  form.submit();
});
