// Get vaccine data
fetch("https://disease.sh/v3/covid-19/vaccine")
  .then((response) => response.json())
  .then((data) => {
    // Main data data.data stored in variable
    let mainData = data.data;

    console.log(data);
    console.log(mainData);

    let candidates = document.querySelector(".total-candidates");
    candidates.innerHTML = `<h4 class="pb-5">Total Candidates: ${data.totalCandidates}</h4>`;

    // main data for cards
    let vacDiv = document.querySelector("#vaccine-data");

    vacDiv.innerHTML = mainData
      .map(
        (element, index) => `
      
        <div id="accordion">
          <div class="card block mb-3">
            <div class="card-header">
              <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" data-target="#z${index}" aria-expanded="true" aria-controls="collapseOne">
                  <strong>Vaccine Candidate:</strong> ${element.candidate}
                </button>
              </h5>
            </div>

            <div id="z${index}" class="collapse"  data-parent="#accordion">
              <div class="card-body">
//                 <p class="text-muted text-left"><strong>Funded by:</strong> ${element.funding[0]}</p>
                <p class="mb-none text-muted text-left"><strong>Institution:</strong> ${element.institutions[0]}</p>
                <p class="mb-none text-muted text-left"><strong>Sponsors:</strong> ${element.sponsors[0]}</p>
                <p class="mb-none text-muted text-left"><strong>Trial phase:</strong> ${element.trialPhase}</p>
                <p class="mb-none text-muted text-left"><strong>${element.details}</strong></p>
              </div>
            </div>
          </div>
          </div>
        </div>`
      )
      .join("");
  });

$(document).ready(function () {
  let maxLength = 300;
  $(".show-read-more").each(function () {
    var myStr = $(this).text();
    if ($.trim(myStr).length > maxLength) {
      var newStr = myStr.substring(0, maxLength);
      var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
      $(this).empty().html(newStr);
      $(this).append(
        ' <a href="javascript:void(0);" class="read-more">read more...</a>'
      );
      $(this).append('<span class="more-text">' + removedStr + "</span>");
    }
  });
  $(".read-more").click(function () {
    $(this).siblings(".more-text").contents().unwrap();
    $(this).remove();
  });
});
