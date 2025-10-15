import React, { useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';

const CocomoEstimator = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    kloc: '',
    mode: '',
    salary: '',
    factors: {
      RELY: 'Nominal', DATA: 'Nominal', CPLX: 'Nominal', TIME: 'Nominal',
      STOR: 'Nominal', VIRT: 'Nominal', TURN: 'Nominal', ACAP: 'Nominal',
      AEXP: 'Nominal', PCAP: 'Nominal', PEXP: 'Nominal', LTEX: 'Nominal',
      MODP: 'Nominal', TOOL: 'Nominal', SCED: 'Nominal'
    }
  });
  const [activeTab, setActiveTab] = useState('input');
  const [errors, setErrors] = useState({});

  const modeNames = {
    organico: 'Orgánico',
    semiacoplado: 'Semiacoplado',
    empotrado: 'Empotrado',
  };

  const validateProject = (project) => {
    const newErrors = {};
    if (!project.name.trim()) newErrors.name = 'El nombre del proyecto es requerido';
    if (!project.mode) newErrors.mode = 'El modo del proyecto es requerido';
    if (!project.kloc || project.kloc <= 0) newErrors.kloc = 'KLOC debe ser mayor a 0';
    if (!project.salary || project.salary <= 0) newErrors.salary = 'El salario debe ser mayor a 0';
    return newErrors;
  };

  const handleAddProject = async () => {
    const validationErrors = validateProject(currentProject);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch('/api/cocomo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kloc: parseFloat(currentProject.kloc),
          mode: currentProject.mode,
          salary: parseFloat(currentProject.salary),
          factors: currentProject.factors
        })
      });

      const results = await res.json();
      const newProject = { ...currentProject, results, id: Date.now() };
      setProjects([...projects, newProject]);
      setActiveTab('results');
    } catch {
      alert('Error en el cálculo');
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentProject({ ...currentProject, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleFactorChange = (factor, value) => {
    setCurrentProject({
      ...currentProject,
      factors: { ...currentProject.factors, [factor]: value }
    });
  };

  const handleRemoveProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const groupedFactors = {
    Producto: ['RELY', 'DATA', 'CPLX'],
    Hardware: ['TIME', 'STOR', 'VIRT', 'TURN'],
    Personal: ['ACAP', 'AEXP', 'PCAP', 'PEXP', 'LTEX'],
    Proyecto: ['MODP', 'TOOL', 'SCED']
  };

 const factorOptions = {
  RELY: { 'Muy Bajo': 0.75, 'Bajo': 0.88, 'Nominal': 1.00, 'Alto': 1.15, 'Muy Alto': 1.40 },
  DATA: { 'Bajo': 0.94, 'Nominal': 1.00, 'Alto': 1.08, 'Muy Alto': 1.16 },
  CPLX: { 'Muy Bajo': 0.70, 'Bajo': 0.85, 'Nominal': 1.00, 'Alto': 1.15, 'Muy Alto': 1.30, 'Extra Alto': 1.65 },
  TIME: { 'Nominal': 1.00, 'Alto': 1.11, 'Muy Alto': 1.30, 'Extra Alto': 1.66 },
  STOR: { 'Nominal': 1.00, 'Alto': 1.06, 'Muy Alto': 1.21, 'Extra Alto': 1.56 },
  VIRT: { 'Muy Bajo': 0.87, 'Bajo': 0.94, 'Nominal': 1.00, 'Alto': 1.10, 'Muy Alto': 1.15 },
  TURN: { 'Bajo': 0.87, 'Nominal': 1.00, 'Alto': 1.07, 'Muy Alto': 1.15 },
  ACAP: { 'Muy Bajo': 1.46, 'Bajo': 1.19, 'Nominal': 1.00, 'Alto': 0.86, 'Muy Alto': 0.71 },
  AEXP: { 'Muy Bajo': 1.29, 'Bajo': 1.13, 'Nominal': 1.00, 'Alto': 0.91, 'Muy Alto': 0.82 },
  PCAP: { 'Muy Bajo': 1.42, 'Bajo': 1.17, 'Nominal': 1.00, 'Alto': 0.86, 'Muy Alto': 0.70 },
  PEXP: { 'Muy Bajo': 1.19, 'Bajo': 1.10, 'Nominal': 1.00, 'Alto': 0.90, 'Muy Alto': 0.85 },
  LTEX: { 'Muy Bajo': 1.14, 'Bajo': 1.07, 'Nominal': 1.00, 'Alto': 0.95, 'Muy Alto': 0.84 },
  MODP: { 'Muy Bajo': 1.24, 'Bajo': 1.10, 'Nominal': 1.00, 'Alto': 0.91, 'Muy Alto': 0.82 },
  TOOL: { 'Muy Bajo': 1.24, 'Bajo': 1.10, 'Nominal': 1.00, 'Alto': 0.91, 'Muy Alto': 0.83 },
  SCED: { 'Muy Bajo': 1.23, 'Bajo': 1.08, 'Nominal': 1.00, 'Alto': 1.04, 'Muy Alto': 1.10 }
};

const factorNames = {
  RELY: 'fiabilidad requerida',
  DATA: 'tamaño de base de datos',
  CPLX: 'complejidad del producto',
  TIME: 'restricciones de tiempo',
  STOR: 'restricciones de memoria',
  VIRT: 'volatilidad del entorno',
  TURN: 'tiempo de respuesta',
  ACAP: 'capacidad del analista',
  AEXP: 'experiencia en aplicación',
  PCAP: 'capacidad del programador',
  PEXP: 'experiencia en plataforma',
  LTEX: 'experiencia en lenguaje/herramientas',
  MODP: 'prácticas modernas',
  TOOL: 'uso de herramientas',
  SCED: 'cronograma requerido',
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* 🔹 contenedor centrado y reducido */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Calculator className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800 text-center">Estimador de Costos COCOMO I</h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6 border-b">
          {['input', 'results'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'input' ? 'Entrada de Datos' : `Resultados (${projects.length})`}
            </button>
          ))}
        </div>

        {/* Formulario principal */}
        {activeTab === 'input' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={currentProject.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Sistema de Gestión"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KLOC (Miles de Líneas de Código) *
                  </label>
                  <input
                    type="number"
                    value={currentProject.kloc}
                    onChange={(e) => handleInputChange('kloc', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.kloc ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 50"
                  />
                  {errors.kloc && <p className="text-red-500 text-sm mt-1">{errors.kloc}</p>}
                </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo del Proyecto *
                  </label>
                  <select
                    value={currentProject.mode}
                    onChange={(e) => handleInputChange('mode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="" disabled hidden>Seleccione un modo</option>
                    <option value="organico">Orgánico</option>
                    <option value="semiacoplado">Semiacoplado</option>
                    <option value="empotrado">Empotrado</option>
                  </select>
                  {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salario Mensual por Persona *
                  </label>
                  <input
                    type="number"
                    value={currentProject.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      errors.salary ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 500000"
                  />
                  {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                </div>
              </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Factores de Costo (15 Multiplicadores)
              </h3>
              {Object.entries(groupedFactors).map(([category, factors]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-3">Atributos del {category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {factors.map(factor => (
                      <div key={factor}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{factor} <span className="text-gray-500">({factorNames[factor]})</span></label>
                        <select
                          value={currentProject.factors[factor]}
                          onChange={(e) => handleFactorChange(factor, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                          {Object.entries(factorOptions[factor]).map(([level, value]) => (
                          <option key={level} value={level}>
                          {level} ({value})
                          </option>
                          ))}
                        </select>

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddProject}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Calcular y Agregar Proyecto
            </button>
          </div>
        )}

        {/* Resultados */}
        {activeTab === 'results' && (
  <div className="space-y-6">
    {projects.length === 0 ? (
      <div className="text-center py-12 text-gray-500">No hay resultados</div>
    ) : (
      projects.map((p) => (
        <div key={p.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          {/* Cabecera del resultado */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
              <p className="text-sm text-gray-600">
                Modo {p.mode.charAt(0).toUpperCase() + p.mode.slice(1)} — {p.kloc} KLOC — Salario: ${p.salary} USD 
              </p>
            </div>
            <button onClick={() => handleRemoveProject(p.id)} className="text-red-500 hover:text-red-700">
              <Trash2 />
            </button>
          </div>

          {/* Resultados principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><b>PM:</b> {p.results.pm} PM</div>
            <div><b>Duración:</b> {p.results.duration} meses</div>
            <div><b>Personas:</b> {p.results.p}</div>
            <div><b>Costo:</b> ${p.results.c} USD</div>
          </div>

{/* Detalles del cálculo */}
<div className="bg-white rounded-lg border border-gray-200 p-4 mt-4 text-sm">
  <h4 className="font-semibold text-gray-800 mb-2">📘 Detalles del cálculo</h4>

  {(() => {
    const { a, b, c, d } = p.results.coeffs || {};
    const kloc = p.kloc;
    const eaf = p.results.eaf;
    const pm = p.results.pm;
    const tdev = p.results.duration;
    const ppl = p.results.p;
    const salary = p.salary; // si lo guardás como número/string en el proyecto
    const cost = p.results.c;

    const fmt = (n) =>
      new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n));
    
    const eafTerms = Object.values(p.results.multipliers)
  .filter(v => Number(v) !== 1)
  .map(v => Number(v).toFixed(2));

    return (
      <div className="space-y-1 text-gray-700">
        <p>
  <b>EAF = </b>{eafTerms.join(' × ')} {eafTerms.length ? '≈ ' : ''}<b>{Number(p.results.eaf).toFixed(2)}</b>
</p>
        <p>
          <b>PM = </b>
          {a} × ({kloc})<sup>{b}</sup> × {eaf} = <b>{fmt(pm)} PM</b>
        </p>
        <p>
          <b>TDEV = </b>
          {c} × ({fmt(pm)})<sup>{d}</sup> = <b>{fmt(tdev)} meses</b>
        </p>
        <p>
          <b>P = </b>
          {fmt(pm)} / {fmt(tdev)} = <b>{fmt(ppl)}</b>
        </p>
        <p>
          <b>C = </b>
          {fmt(ppl)} × {fmt(salary)} = <b>${fmt(cost)} USD</b>
        </p>
      </div>
    );
  })()}
</div>

        </div>
      ))
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default CocomoEstimator;
