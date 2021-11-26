let submit = false;
const $form = document.querySelector('#form');
$form.addEventListener('submit',(evt)=>{
   if (!submit){
    evt.preventDefault()
   }
});

const btn = document.getElementById('send');

btn.addEventListener('click', ()=>{

    getData();
});

const getData = ()=>{
    const username = document.getElementById("username");
    const room = document.getElementById("room");

    if (username.value == ""){
        document.getElementById("username").focus();
    }else{
        if (room.value == ""){
            document.getElementById("room").focus();
        }else{
            localStorage.setItem('username',username.value);
            localStorage.setItem('room',room.value);
            submit = true;
        }
    }
}
