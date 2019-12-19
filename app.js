const lessonController = (function () {
    const Lessons = function (id, name, lCredi, lNote) {
        this.id = id;
        this.name = name;
        this.lCredi = lCredi;
        this.lNote = lNote;
    };

    const data = {
        lessons:[],
        selectedLesson: null
    };

    return {
      getLessons: function () {
          return data.lessons;
      },
      getData: function () {
        return data
      },
      addLesson: function (name,credi,credinote) {
          let id;
          if (data.lessons.length > 0) {
              id = data.lessons[data.lessons.length-1].id+1;
          }else{
              id=0
          }
          const newLesson = new Lessons(id,name,credi,credinote);
          data.lessons.push(newLesson);
      },
      calculateNote: function () {
          let total = 0;
          let totalCredi = 0;

          data.lessons.forEach(lesson => {
            total += parseFloat(lesson.lCredi)*parseFloat(lesson.lNote);
            totalCredi += parseFloat(lesson.lCredi);
          });
          return total/totalCredi;
      },
      searchLesson: function (lesid) {
          let selected = null;
          data.lessons.forEach(lesson => {
              if (lesson.id == lesid) {
                selected = lesson;
              }
          });
          data.selectedLesson = selected;
      },
      updateLesson: function (name, credi, credinote) {
          data.lessons.forEach(les => {
              if (les.id === data.selectedLesson.id) {
                les.name = name;
                les.lCredi = credi;
                les.lNote = credinote;
              }
          });

          uiController.listLessons(data.lessons);
          const result = lessonController.calculateNote();
          uiController.showResult(result);
          uiController.defaultShowButton();
          uiController.clearInput();
      },
      removeLesson: function (deleteid) {
          data.lessons.forEach(les => {
              if (les.id === deleteid) {
                  const index = data.lessons.indexOf(les);
                  data.lessons.splice(index,1);
              }
          });
          if (data.lessons.length === 0) {
            document.querySelector("#productCard").style.display="none";
            const result = 0;
            uiController.showResult(result);
            uiController.defaultShowButton();
            uiController.clearInput();
          }else
          {
              uiController.listLessons(data.lessons);
              const result = lessonController.calculateNote();
              uiController.showResult(result);
              uiController.defaultShowButton();
              uiController.clearInput();
          }





      }

    }
})();

const uiController = (function () {
    return{
        listLessons: function (lessons) {
            let html = "";
            lessons.forEach(lesson => {
                html += `
                        <tr>
                            <td>${lesson.id}</td>
                            <td>${lesson.name}</td>
                            <td><b>${lesson.lCredi}</b>  Kredi</td>
                            <td>${lesson.lNote}</td>
                            <td class="text-right">
                                    <button type="submit" class="btn btn-warning btn-sm selected">
                                        <i class="far fa-edit selected"></i> Düzenle
                                    </button>  
                                </td>
                        </tr>                
                `;
                document.querySelector("#lesson-list").innerHTML = html;
            }
            )

        },
        listSemester: function (count) {
            let html="";
            for (let i = 0; i < count; i++ ) {
                html += `<div class="row ml-2">
                        <div class="col-md-12">
                            <span><b>${i+1}. dönem ortalamanız:</b></span>
                            <input id="${i}" value="0" type="number" class="form-control">
                        </div>
                    </div> `;
                document.querySelector("#semester-list").innerHTML = html;
            }
        },
        clearInput: function () {
            document.querySelector("#lessonName").value="";
            document.querySelector("#lessonCredi").value="";
            document.querySelector("#lessonCrediNote").value="";
        },
        showResult: function (result) {
            result = result.toFixed(3);
          document.querySelector("#donem-ortalama").textContent= result;
        },
        defaultShowButton: function () {
            document.querySelector(".addBtn").style.display="inline";
            document.querySelector(".deleteBtn").style.display="none";
            document.querySelector(".cancelBtn").style.display="none";
            document.querySelector(".saveBtn").style.display="none";
        },
        defaultShowAlert: function () {
            document.querySelector("#alert").style.display="none";
        },
        alertMessage: function (message) {
            document.querySelector("#alert").style.display="inline";
            document.querySelector("#alert").innerHTML = message;
        },
        writeInput: function () {
            document.querySelector("#lessonName").value = lessonController.getData().selectedLesson.name;
            document.querySelector("#lessonCredi").value = lessonController.getData().selectedLesson.lCredi;
            document.querySelector("#lessonCrediNote").value = lessonController.getData().selectedLesson.lNote;
        },
        selectedLesson: function (tr) {
            const parent = tr.parentNode;
            for (let i=0; i<parent.children.length; i++) {
                parent.children[i].classList.remove("bg-warning")
            };
            tr.classList.add("bg-warning");
            document.querySelector(".addBtn").style.display="none";
            document.querySelector(".deleteBtn").style.display="inline";
            document.querySelector(".cancelBtn").style.display="inline";
            document.querySelector(".saveBtn").style.display="inline";
        }
    }
})();


const AppController = (function (lessonctrl, uictrl) {
    loadEvents = function () {
        // Ders Ekleme
        document.querySelector(".addBtn").addEventListener("click", addLesson);
        //Ders Seçme
        document.querySelector("#lesson-list").addEventListener("click",selectedLesson);
        //Ders Guncelleme
        document.querySelector(".saveBtn").addEventListener("click", updateSaveLesson);
        //Ders Secimi İptali
        document.querySelector(".cancelBtn").addEventListener("click", cancelLesson);
        //Ders Silme
        document.querySelector(".deleteBtn").addEventListener("click", deleteLesson);
        //Genel Not Hesaplama
        document.querySelector(".noteBtn").addEventListener("click", semesterList);
        document.querySelector("#semesterCalculate").addEventListener("click", calculateNote)


    };

    const addLesson = function (e) {

       document.querySelector("#productCard").style.display="inline";
       const lessonName = document.querySelector("#lessonName").value;
       const lessonCredi =document.querySelector("#lessonCredi").value;
       const lessonCrediNote =document.querySelector("#lessonCrediNote").value;

       if (lessonName!=="" && lessonCredi!=="" && lessonCrediNote!==""){

           if (lessonCrediNote > 4 || lessonCrediNote < 0 || lessonCredi < 0) {
                uictrl.alertMessage("Harf notu katsayısı aralığı (0-4), ders kredisi (0-~) olmalıdır.")
           }
           else{
               lessonctrl.addLesson(lessonName,lessonCredi,lessonCrediNote);
               const data = lessonctrl.getLessons();
               uictrl.listLessons(data);
               uictrl.clearInput();
               const result = lessonctrl.calculateNote();
               uictrl.showResult(result);
               uictrl.defaultShowAlert();
           }
       }
       else{
           uictrl.alertMessage("Lütfen istenilen yerleri boşluksuz ve uygun formatta doldurun.")
       }

        e.preventDefault(); 
    };
    const selectedLesson = function (e) {
        if (e.target.classList.contains("selected")) {
            const lessonID = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            lessonctrl.searchLesson(lessonID);
            uictrl.writeInput();
            const tr = e.target.parentNode.parentNode;
            uictrl.selectedLesson(tr);
        }
        e.preventDefault();
    };
    const updateSaveLesson = function (e) {
        const lName = document.querySelector("#lessonName").value;
        const lCredi =document.querySelector("#lessonCredi").value;
        const lCrediNote =document.querySelector("#lessonCrediNote").value;
        if (lName !=="" && lCredi !=="" && lCrediNote !=="") {
            if (lCrediNote > 4 || lCrediNote<0 || lCredi<0) {
                uictrl.alertMessage("Harf notu katsayısı aralığı (0-4), ders kredisi (0-~) olmalıdır.")
            } else{
                lessonctrl.updateLesson(lName,lCredi,lCrediNote);
                uictrl.defaultShowAlert();
            }

        }else{
            uictrl.alertMessage("Güncelleme yapmak için bütün bilgileri eksiksiz ve uygun formatta doldurun.")
        }
        e.preventDefault()
    };
    const cancelLesson = function (e) {
        const lessons = lessonctrl.getLessons();
        uictrl.listLessons(lessons);
        uictrl.defaultShowButton();
        uictrl.clearInput();
        uictrl.defaultShowAlert();
        e.preventDefault();
    };
    const deleteLesson = function (e) {
        const deleteID = lessonctrl.getData().selectedLesson.id;
        lessonctrl.removeLesson(deleteID);
        e.preventDefault();
    };
    const semesterList = function (e) {
        const donemSayisi = document.querySelector("#semesterCount").value;
        if (donemSayisi==0 || donemSayisi== "" ) {
            document.querySelector("#genel-ortalama").textContent= "Dönem sayısı 0 olamaz veya boş bırakılamaz.";
            document.querySelector("#genelortalama").style.display = "none";
        }else{
            document.querySelector("#genel-ortalama").textContent= "";
            document.querySelector("#genelortalama").style.display = "inline";
            uictrl.listSemester(donemSayisi);
        }


        e.preventDefault();
    };
    const calculateNote = function (e) {
        const donemSayisi = document.querySelector("#semesterCount").value;
        let toplam = 0;
        let sonuc = true;
        for (let i=0; i<donemSayisi; i++)
        {
            if (document.getElementById(`${i}`).value !== "") {
                toplam += parseFloat(document.getElementById(`${i}`).value);
            }else{
                sonuc = false;
                break
            }
        }
        if (sonuc == true) {
            document.querySelector("#genel-ortalama").textContent= (toplam/donemSayisi).toFixed(2);
        }else {
            document.querySelector("#genel-ortalama").textContent= "Lütfen bütün alanları eksiksiz ve uygun formatta doldurun.";
        }

        e.preventDefault();
        };


    return{
        init: function () {
            const lessons = lessonctrl.getLessons();
            uictrl.listLessons(lessons);
            uictrl.defaultShowButton();
            uictrl.defaultShowAlert();
            loadEvents();
        }
    }
})(lessonController,uiController);

AppController.init();
