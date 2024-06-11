"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};

Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fetch = __importStar(require("node-fetch"));
const axios = __importStar(require("axios"));
const { Octokit } = __importStar(require("@octokit/core"));

async function run() {
    try {
        const token = core.getInput('TOKEN');
        const owner = core.getInput('OWNER');
        const repo = core.getInput('REPO');
        const inputs = JSON.parse(core.getInput('INPUTS'));
        const job_index = core.getInput('JOB_INDEX');
        var runs_response;
        var run_resource;
        var run_userID;
        var wf_found = 0;
        var jobs_response;
        var job_id;

        const octokit = new Octokit({
            auth: token,
            request: {
                fetch: fetch,
            },
        });

        async function myFunction(){
            runs_response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs?status=completed', {
                owner: owner,
                repo: repo,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        }

        async function myFunction2(){
            await myFunction();
            for (var i = 0; i < runs_response.data.workflow_runs.length; i++) { 
                run_resource = runs_response.data.workflow_runs[i].name.replace(/^Retrieve '(.*)',.*$/, "$1");
                run_userID = runs_response.data.workflow_runs[i].name.replace(/^.*requested by (.*)\.$/, "$1");
                
                if (run_resource == inputs.resource && run_userID == inputs.userID){
                    wf_found = 1;
                    
                    // Lists the workflow run's jobs:
                    jobs_response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
                        owner: owner,
                        repo: repo,
                        run_id: runs_response.data.workflow_runs[i].id,
                        headers: {
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                    });

                    job_id = jobs_response.data.jobs[job_index].id;

                    const axiosInstance = axios.create({
                        baseURL: 'https://api.github.com',
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                            'Authorization': 'token ' + token,
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                    });

                    axiosInstance.defaults.maxRedirects = 0; // Set to 0 to prevent automatic redirects

                    axiosInstance.interceptors.response.use(
                        function(response){
                            // Should never occur as this API call always returns a 302 (redirect). 
                            return response;
                        },
                        function(error) {
                            if (error.response && [301, 302].includes(error.response.status)) {
                                core.setOutput('url', error.response.headers.location);
                            }
                            return error;
                        }
                        );

                    await axiosInstance.get(`/repos/${owner}/${repo}/actions/jobs/${job_id}/logs`);

                    break;
                }
            }
        };

        // Function that resolves after a sleep time
        async function sleep(ms) {
            return new Promise(function(resolve){
                setTimeout(resolve, ms);
            });
        }

        // Loop until timeout.
        for (var l = 0; l < 30; l++) {
            await myFunction2();

            if (wf_found) {
                break;
            };
            // Wait 1 second before re-calling the function. Timeout after 30 seconds (30 * 1 second);
            await sleep(1000);
        }

        if (!wf_found){
            throw "Error: A workflow matching the specified resource and userID was not found.";
        };

    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
