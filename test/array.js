// [1, 2, 3].forEach((elemen, index) => {
//   console.log(elemen, index);
// });


`




<% if (!user) { %>
<script> window.location = "/login"; </script>
<% } %>



`



((diamiter , PI) => PI * diamiter )(2 , 3.1434355) // output 6.286871

((diamiter) => 3.1434355 * diamiter)(2); // output 6.286871

((PI) => (diamiter) => PI * diamiter)(3.1434355)(2);  // output 6.286871

((diamiter) => (PI) => PI * diamiter )(3.1434355)(2);  // output 6.286871

((diamiter) => { const PI = 3.1434355 ; return PI * diamiter; })(2);  // output 6.286871 ( side effect :(  ) 


