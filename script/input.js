Array.from(document.querySelectorAll('.input')).forEach(item => {
    const input = item.querySelector('.input__input');
    const clear = item.querySelector('.input__clear');
    
    input.b = {};
    
    input.b.enable = () => {
      item.classList.remove('input_disabled');
      input.disabled = false;
    }
    
    input.b.disable = () => {
      item.classList.add('input_disabled');
      input.disabled = true;
    }
    
  //  clear.onclick = () => {input.value = ''};
    
    const validateTel = () => {
      
      
      input.value = '+7' + input.value
        .replace('+7', '')
        .replace(/\D/g, '')
        .substring(0,10);
      
      input.value =(
        input.value.slice(0, 8) + ' ' +
        input.value.slice(8, 10) + ' ' +
        input.value.slice(10))
      .trim()
      .replaceAll(' ', '-')
      
      input.value =(
        input.value.slice(0, 2) + ' ' +
        input.value.slice(2, 5) + ' ' +
        input.value.slice(5))
      .trim()
      
    }
    if (input.getAttribute('type') == "tel") {
      validateTel()
      input.addEventListener('input', () => validateTel())
    }
    
    const validateEmail = () => {
      input.b.valid = input.value
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      
    };
    
    if (input.getAttribute('type') == "email") {
      validateEmail()
      input.addEventListener('input', () => validateEmail())
    }
  })