const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null, raw: data });
        } catch {
          resolve({ status: res.statusCode, body: data, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('=== STARTING BACKEND FLOW AUDIT ===\n');

  // 1. Health
  const health = await request('/api/health');
  console.log('Health Check:', health.status === 200 ? 'PASS' : 'FAIL', health.body);

  // 2. Summary
  const summary = await request('/api/dashboard/summary');
  console.log('\nSummary Check:');
  console.log('Status:', summary.status);
  console.log('Total Projects:', summary.body?.totalProjects);
  console.log('Active Projects:', summary.body?.activeProjects);
  console.log('Completed Tasks:', summary.body?.completedTasks);
  console.log('Pending Tasks:', summary.body?.pendingTasks);

  // 3. Projects List
  const projects = await request('/api/projects');
  console.log('\nProjects Check:');
  console.log('Count:', projects.body?.length);
  const first = projects.body?.[0];
  console.log('First project fields:', {
    id: first?.id,
    title: first?.title,
    status: first?.status,
    taskCount: first?.taskCount,
    completedTaskCount: first?.completedTaskCount,
    progress: first?.progress
  });

  // 4. Filter
  const activeProjects = await request('/api/projects?status=Active');
  const completedProjects = await request('/api/projects?status=Completed');
  const onHoldProjects = await request('/api/projects?status=On%20Hold');
  console.log('\nFilter Check:');
  console.log('Active count:', activeProjects.body?.length);
  console.log('Completed count:', completedProjects.body?.length);
  console.log('On Hold count:', onHoldProjects.body?.length);

  // 5. Invalid Project Validation (Zod)
  const invalidProject = await request('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { title: ' ', description: 'ab', deadline: 'invalid-date' }
  });
  console.log('\nValidation Check (Invalid Project POST):');
  console.log('Status (expected 400):', invalidProject.status);
  console.log('Body:', invalidProject.body);

  // 6. Project Detail & 404
  const detail = await request('/api/projects/1');
  console.log('\nProject 1 Detail Status:', detail.status, 'Tasks:', detail.body?.tasks?.length);

  const notFound = await request('/api/projects/99999');
  console.log('Non-existent Project Status (expected 404):', notFound.status, notFound.body);

  // 7. Tasks on non-existent project
  const taskOnMissing = await request('/api/projects/99999/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { title: 'New Task' }
  });
  console.log('\nTask on non-existent project Status (expected 404):', taskOnMissing.status, taskOnMissing.body);

  // 8. Task validation: blank title
  const blankTask = await request('/api/projects/1/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { title: '   ' }
  });
  console.log('Blank Task Status (expected 400):', blankTask.status, blankTask.body);

  // 9. SPA Fallback check
  const spaFallback = await request('/app/projects/1');
  console.log('\nSPA Fallback Status for /app/projects/1 (expected 200 with HTML):', spaFallback.status, typeof spaFallback.raw === 'string' && spaFallback.raw.includes('<div id="root">') ? 'PASS (HTML returned)' : 'FAIL');

  console.log('\n=== AUDIT COMPLETED ===');
}

runAudit().catch(console.error);
