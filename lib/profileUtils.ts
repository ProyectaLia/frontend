// Utilidades para skills/interests y estados de proyectos/solicitudes

export function stringToArray(str?: string): string[] {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

export function arrayToString(arr?: string[]): string {
  if (!arr) return '';
  return arr.join(',');
}

export function getStatusLabel(status: string) {
  switch ((status || '').toUpperCase()) {
    case 'BUSCANDO_COLABORADORES':
      return 'Buscando Colaboradores';
    case 'EN_DESARROLLO':
      return 'En Desarrollo';
    case 'FINALIZADO':
    case 'COMPLETADO':
      return 'Finalizado';
    default:
      return status
        ? status
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
        : 'Desconocido';
  }
}

export const AREAS = [
  'Tecnología Verde',
  'Educación',
  'Salud y Bienestar',
  'Emprendimiento',
  'Arte y Cultura',
  'Ciencia e Investigación',
  'Desarrollo Social',
  'Innovación Tecnológica',
  'Deportes',
  'Otro',
];

export const SKILLS = [
  'React',
  'Python',
  'Node.js',
  'UX/UI Design',
  'Machine Learning',
  'Flutter',
  'Marketing Digital',
]; 