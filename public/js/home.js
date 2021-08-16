const deleteNote = (btn) => {
  const noteId = btn.parentNode.querySelector("[name=elementId]").value;
  const noteElement = btn.closest("article");
  fetch("/delete/" + noteId, {
    method: "DELETE",
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
