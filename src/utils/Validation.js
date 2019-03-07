// ("#root > div > form > div > div > input,select");
export function showFormErrors(querySelector) {
  const inputs = document.querySelectorAll(querySelector);
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    switch (input.type) {
      case "hidden":
        continue;
      default:
        break;
    }
    showInputError(input);
  }
}

export function showInputError(input) {
  try {
    const name = input.name;
    const validity = input.validity;
    const label = document.querySelector(`label[for='${input.id}']`)
      .textContent;
    const error = document.getElementById(`${name}Error`);
    switch (input.type) {
      case "select-one":
        if (input.value === "-1") {
          error.textContent = `${label} is a required field`;
          input.classList.add("is-invalid");
          input.classList.remove("is-valid");
        } else {
          input.classList.remove("is-invalid");
          input.classList.add("is-valid");
        }
        break;
      case "select":
        if (input.value === "-1") {
          error.textContent = `${label} is a required field`;
          input.classList.add("is-invalid");
          input.classList.remove("is-valid");
        } else {
          input.classList.remove("is-invalid");
          input.classList.add("is-valid");
        }
        break;
      case "text":
        if (!validity.valid) {
          if (validity.valueMissing) {
            error.textContent = `${label} is a required field`;
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
          }
          return false;
        } else {
          if (!validity.valueMissing) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
          }
        }
        break;
      case "number":
        if (!validity.valid) {
          if (validity.valueMissing) {
            error.textContent = `${label} is a required field`;
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
          }
          return false;
        } else {
          if (!validity.valueMissing) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
          }
        }

        error.textContent = "";
        return true;
      default:
        break;
    }
  } catch (err) {}
}
export function clearInputsColours(inputs) {
  var inputs = document.querySelectorAll(inputs);
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    input.classList.remove("is-invalid");
    input.classList.remove("is-valid");
  }
}
