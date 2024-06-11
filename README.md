# Get Output URL v2

Gets the URL of a workflow's log without redirecting to the location and insecurely sharing the request's authorization header with a third-party site.

## Installation
```yaml
- name: Get Output URL v2
  uses: robbienutland/github-actions-get-output-url-v2@1.0.0
```

## Usage

The required inputs are `TOKEN`, `OWNER`, `REPO`, `WORKFLOW_ID`, `REF`, `INPUTS`, and `JOB_INDEX`.
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
          INPUTS: '{"userID": "1234567890ABCDEFGHIJKLMNOPQR", "resource": "myData"}'
          JOB_INDEX: 0

      - name: DUMP URL
        run: echo ${{steps.outputURL.outputs.url}}

```
