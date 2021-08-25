const deleteNote = (btn) => {
  const noteId = btn.parentNode.querySelector("[name=elementId]").value;
  const noteElement = btn.closest("article");
  const _csrf = document.getElementById("_csrf");
  console.log(_csrf.value);

  fetch(`/delete/?_csrf=${_csrf.value}/` + noteId, {
    method: "POST",
  })
    .then((result) => {
      console.log("found feeding route ");
      result
        .json()
        .then((data) => {
          noteElement.parentNode.removeChild(noteElement);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
