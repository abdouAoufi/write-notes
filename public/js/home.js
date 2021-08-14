const deleteNote = (btn) => {
  const noteId = btn.parentNode.querySelector("[name=elementId]").value;
  fetch("/delete/" + noteId, {
    method: "DELETE",
  })
    .then((result) => {
      console.log("found feeding route ");
      result
        .json()
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
