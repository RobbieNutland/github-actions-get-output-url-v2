# Get Output URL v2

Gets the URL of a workflow's log without redirecting to the location and insecurely sharing the request's authorization header with a third-party site.

## Installation
```yaml
- name: Get Output URL v2
  uses: robbienutland/github-actions-get-output-url-v2@1.0.0
```

## Usage

The required inputs are `APP_ID`, `APP_PRIVATEKEY`, `INSTALLATION_ID`, `OWNER`, `REPO`, `WORKFLOW_ID`, `REF`, `INPUTS`, and `JOB_INDEX`. It is recommended to store the APP_PRIVATEKEY as an encrypted [environment variable.](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables)

The output where the generated URL is in `url`. To use it in a next step use `${{steps.<step_id>.outputs.url}}`.

### Example usage
```yaml
on: [push]

jobs:
  send:
    name: Get a workflow's job log URL 
    runs-on: ubuntu-latest
    steps:
      - name: Get Output URL v2
        id: outputURL
        uses: robbienutland/github-actions-get-output-url-v2@1.0.0
        with:
          TOKEN: ghs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          OWNER: 'RobbieNutland'
          REPO: 'MyRepository'
          WORKFLOW_ID: 'MyWorkflow'
          INPUTS: '{"userID": "1234567890ABCDEFGHIJKLMNOPQR", "resource": "myData"}'
          JOB_INDEX: 0

      - name: DUMP URL
        run: echo ${{steps.outputURL.outputs.url}}

```
