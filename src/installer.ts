import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

import * as path from 'path';

export async function getMaven(version: string) {
  let toolPath = tc.find('maven', version);

  if (!toolPath) {
    toolPath = await downloadMaven(version);
  }

  core.addPath(path.join(toolPath, 'bin'));
}

async function downloadMaven(version: string): Promise<string> {
  const toolDirectoryName = `apache-maven-${version}`;
  const downloadUrl = `https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${version}/${toolDirectoryName}-bin.tar.gz`;

  core.debug(`Downloading ${downloadUrl}`);
  const downloadPath = await tc.downloadTool(downloadUrl);
  const extractedPath = await tc.extractTar(downloadPath);

  const toolRoot = path.join(extractedPath, toolDirectoryName);
  return await tc.cacheDir(toolRoot, 'maven', version);
}
