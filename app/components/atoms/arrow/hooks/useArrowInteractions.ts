import { useEffect, useRef, useState } from "react";

interface UseArrowInteractionsProps {
  id: string;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const useArrowInteractions = ({ id, onSelect, onDelete }: UseArrowInteractionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimationsMenuOpen, setIsAnimationsMenuOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const animationsMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Eventos del mouse
  const handleMouseEnter = () => {
    // No se hace nada en el hover ahora
  };

  const handleMouseLeave = () => {
    // No se hace nada en el hover ahora
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onSelect) {
      onSelect(id);
    }

    // Abrir el modal completo con un solo clic
    setIsOptionsModalOpen(true);

    // Prevenir scroll cuando el modal está abierto
    document.body.classList.add("overflow-hidden");

    // Cerrar los submenús si están abiertos
    setIsAnimationsMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Ya no necesitamos doble clic pero mantenemos para compatibilidad
  const handleArrowDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsOptionsModalOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  // Efecto para cerrar menús al hacer clic fuera
  useEffect(() => {
    // Función para detectar clics fuera del menú
    function handleClickOutside(event: MouseEvent) {
      // Si el menú de opciones está abierto y el clic fue fuera del menú
      if (
        isMenuOpen &&
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsAnimationsMenuOpen(false);
      }

      // Si el menú de animaciones está abierto y el clic fue fuera de ese menú
      if (
        isAnimationsMenuOpen &&
        animationsMenuRef.current &&
        !animationsMenuRef.current.contains(event.target as Node)
      ) {
        setIsAnimationsMenuOpen(false);
      }

      // Si el modal de opciones está abierto y el clic fue fuera del modal
      if (
        isOptionsModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    }

    // Agregar el event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener al desmontar
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isAnimationsMenuOpen, isOptionsModalOpen]);

  // Manejar el botón de animaciones
  const handleAnimationButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Alternar menú de animaciones sin cerrar el menú principal
    setIsAnimationsMenuOpen(!isAnimationsMenuOpen);
  };

  // Eliminar la conexión
  const handleDelete = () => {
    // Confirmar antes de eliminar
    if (window.confirm("¿Estás seguro de que quieres eliminar esta conexión?")) {
      if (onDelete) {
        onDelete(id);
      }
    }

    // Cerrar menús después de eliminar o cancelar
    setIsMenuOpen(false);
    setIsOptionsModalOpen(false);
  };

  return {
    isMenuOpen,
    isAnimationsMenuOpen,
    isOptionsModalOpen,
    setIsMenuOpen,
    setIsAnimationsMenuOpen,
    setIsOptionsModalOpen,
    optionsMenuRef,
    animationsMenuRef,
    modalRef,
    handleMouseEnter,
    handleMouseLeave,
    handleArrowClick,
    handleArrowDoubleClick,
    closeModal,
    handleAnimationButtonClick,
    handleDelete,
  };
};
