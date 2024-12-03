Happy Hacking!!, 


 <tbody>
                <% submissions.forEach(submission => { %>
                  <tr>
                    <td>
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm"><%= submission.authorName %></h6>
                          <p class="text-xs text-secondary mb-0"><%= submission.email %></p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <h6 class="mb-0 text-sm"><%= submission.paperTitle %></h6>
                      <p class="text-xs text-secondary mb-0"><%= submission.submissionId %></p>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-xs font-weight-bold"><%= submission.country %></span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="badge badge-sm bg-gradient-info"><%= submission.status %></span>
                    </td>
                  </tr>
                <% }) %>
              </tbody>

 <% submissions.forEach(submission => { %>
               <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                           <%= submission.authorName %>
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm"><%= submission.email %></h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-group mt-2">
                          <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Ryan Tompson">
                           <%= submission.paperTitle %>
                          </a>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"><%= submission.submissionId %></span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold"><%= submission.country %></span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-info w-25" role="progressbar" aria-valuenow="25"
                              aria-valuemin="0" aria-valuemax="25"><%= submission.status %></div>
                          </div>
                        </div>
                      </td>
                    </tr>  <% }) %>

                    const PAYPAL_CLIENT_ID = 'AW6S_R9zDD2pqtsAAa0582e2vGdM-dwD1CrAhbQNw_7rFOtXeY-ZYOtR3C4V4ciHSwYJnoZ0v2juVm80'; // Replace with your PayPal Client ID
const PAYPAL_SECRET = 'EHOyylQImLoyvkYNLCoBFKgRsOquDuEYH3noHxq7Mi-8piCk58IbZ-bWuUGSNC00Ew0Hyf0CpNugjYP4';  // Replace with your PayPal Secret
const PAYPAL_API = 'AVNSOBcTvYyqXosD6oFfXr91ALohxbFi4BaDkNd858vGhk5L9bFIeqn2n8L0aJSIMSP5AtcNdzVODhU4'; // Use sandbox for testing, live for production
