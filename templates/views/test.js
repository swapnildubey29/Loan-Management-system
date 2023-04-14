function populateRequests( arr)
        {
                let element = document.getElementById("requests-table-body"); 
                 if( arr.length == 0)
                 {
                    console.log("no request")
                 }
                 else {
                    let temp = ``;
                    
                 arr.forEach(element => {
                     temp += `<tr>                       
                               <td>${element.name}</td>
                               <td>${element.email}</td>
                               <td>${element.num}</td>
                               <td>${element.interest}</td>
                               <td>${element.amount}</td>
                               <td>${element.status? "accepted" : "Pending"}</td>
                               </tr>`;
                 });
                 element.innerHTML = temp;
                 }
            }
            console.log("hello"); 
            let requestStatus =[{
                name: "karankumar",
                email:"karankumar560k",
                num:"9886564458",
                amount:"70",
                interest : "78", 
                status : false 
            }]
           
            
            populateRequests(requestStatus); 

let acceptBtn = document.getElementById("acceptBtn");

acceptBtn.addEventListener("click",()=>{
     let values={};
     requestStatus.push(values);
     populateRequests(requestStatus);  

})

console.log("Hello"); 
