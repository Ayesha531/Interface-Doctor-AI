const flows = [
  {
    name: 'Upload',
    empty: 'No screenshot selected',
    loading: 'Reading selected image',
    success: 'Screenshot ready',
    error: 'Type/size validation failed',
  },
  {
    name: 'AI diagnosis',
    empty: 'No diagnosis requested',
    loading: 'Vision model analyzing',
    success: 'Findings returned',
    error: 'Service or response issue',
  },
  {
    name: 'Generation',
    empty: 'Not built in Phase 1',
    loading: 'Reserved for Phase 2',
    success: 'Reserved for Phase 2',
    error: 'Reserved for Phase 2',
  },
  {
    name: 'Verification',
    empty: 'Not built in Phase 1',
    loading: 'Reserved for Phase 3',
    success: 'Reserved for Phase 3',
    error: 'Reserved for Phase 3',
  },
  {
    name: 'Saving',
    empty: 'Not built in Phase 1',
    loading: 'Reserved for Phase 3',
    success: 'Reserved for Phase 3',
    error: 'Reserved for Phase 3',
  },
];

export function FlowStateMatrix() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="text-xl font-black text-slate-950">Flow state coverage</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Phase 1 implements upload and diagnosis; later flows are shown as explicit non-active states so the product does not imply unsupported behavior.
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 text-xs">
        <div className="grid grid-cols-5 bg-slate-950 font-bold text-white">
          <span className="p-2">Flow</span><span className="p-2">Empty</span><span className="p-2">Loading</span><span className="p-2">Success</span><span className="p-2">Error</span>
        </div>
        {flows.map((flow) => (
          <div key={flow.name} className="grid grid-cols-5 border-t border-slate-200 bg-white text-slate-600">
            <span className="p-2 font-bold text-slate-950">{flow.name}</span>
            <span className="p-2">{flow.empty}</span>
            <span className="p-2">{flow.loading}</span>
            <span className="p-2">{flow.success}</span>
            <span className="p-2">{flow.error}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
