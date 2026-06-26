// Vitrina de componentes compartidos (estándar Captec adaptado)

import { useState } from 'react';

import { AppLayout } from '@shared/ui/templates/AppLayout';

import { ScreenPage } from '@shared/ui/templates/ScreenPage';

import { SectionCard } from '@shared/ui/molecules/SectionCard';

import { FormGrid } from '@shared/ui/molecules/FormGrid';

import { FormActions } from '@shared/ui/molecules/ButtonGroup';

import { ActionButton } from '@shared/ui/atoms/ActionButton';

import { Button } from '@shared/ui/atoms/Button';

import { ButtonGroup } from '@shared/ui/molecules/ButtonGroup';

import { Input } from '@shared/ui/atoms/Input';

import { Select } from '@shared/ui/atoms/Select';

import { TextArea } from '@shared/ui/atoms/TextArea';

import { FormField } from '@shared/ui/molecules/FormField';

import { SearchBar } from '@shared/ui/molecules/SearchBar';

import { FilterChipGroup } from '@shared/ui/molecules/FilterChipGroup';

import { StatusBadge } from '@shared/ui/molecules/StatusBadge';

import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';

import { Modal } from '@shared/ui/molecules/Modal';

import { Table } from '@shared/ui/molecules/Table';

import { useToast } from '@shared/hooks/useToast';



export function ShowcasePage() {

  const toast = useToast();

  const [tab, setTab] = useState('inputs');

  const [modalOpen, setModalOpen] = useState(false);

  const [chip, setChip] = useState('a');

  const [search, setSearch] = useState('');



  return (

    <AppLayout>

      <ScreenPage
        title="Componentes (Demo)"
        description="Catálogo de átomos y moléculas del proyecto — usar en pantallas, no duplicar."
      >

        <TabbedContentShell

          tabs={[

            { id: 'inputs', label: 'Entradas' },

            { id: 'acciones', label: 'Acciones' },

            { id: 'datos', label: 'Datos' },

          ]}

          activeTab={tab}

          onTabChange={setTab}

        >

          {tab === 'inputs' && (

            <SectionCard title="Formulario de ejemplo">

              <FormGrid columns={3}>

                <FormField label="Texto" htmlFor="demo-text" required layout="grid">

                  <Input id="demo-text" placeholder="Ejemplo…" />

                </FormField>

                <FormField label="Select" htmlFor="demo-select" layout="grid">

                  <Select id="demo-select">

                    <option>Opción A</option>

                    <option>Opción B</option>

                  </Select>

                </FormField>

                <FormField label="Búsqueda" htmlFor="demo-search" layout="grid">

                  <SearchBar value={search} onChange={setSearch} id="demo-search" />

                </FormField>

              </FormGrid>

              <FormField label="Textarea" htmlFor="demo-area" className="mt-4">

                <TextArea id="demo-area" rows={2} placeholder="Notas…" />

              </FormField>

            </SectionCard>

          )}



          {tab === 'acciones' && (

            <SectionCard title="Botones y estados">

              <ButtonGroup ariaLabel="Variantes de botón">

                <ActionButton type="button">Primary</ActionButton>

                <Button type="button" variant="secondary">

                  Secondary

                </Button>

                <ActionButton type="button" variant="outline">

                  Outline

                </ActionButton>

                <Button type="button" variant="ghost" aria-label="Cerrar">

                  ✕

                </Button>

                <Button type="button" variant="muted">

                  Muted

                </Button>

                <ActionButton type="button" onClick={() => setModalOpen(true)}>

                  Abrir modal

                </ActionButton>

                <ActionButton type="button" variant="outline" onClick={() => toast.success('Toast de ejemplo')}>

                  Toast

                </ActionButton>

              </ButtonGroup>

              <FormGrid columns={3} className="mt-6 max-w-3xl">

                <FormField label="Campo A" htmlFor="align-a" layout="grid">

                  <Input id="align-a" placeholder="Texto…" />

                </FormField>

                <FormField label="Campo B" htmlFor="align-b" layout="grid">

                  <Select id="align-b">

                    <option>Opción 1</option>

                  </Select>

                </FormField>

                <FormActions>

                  <ActionButton type="button" fullWidth>

                    Alineado

                  </ActionButton>

                </FormActions>

              </FormGrid>

              <div className="mt-4 flex flex-wrap gap-2">

                <StatusBadge status="aprobado" />

                <StatusBadge status="pendiente" />

                <StatusBadge status="rechazado" />

              </div>

            </SectionCard>

          )}



          {tab === 'datos' && (

            <div className="flex flex-col gap-6">

              <FilterChipGroup

                options={[

                  { value: 'a', label: 'Chip A' },

                  { value: 'b', label: 'Chip B', count: 3 },

                ]}

                value={chip}

                onChange={setChip}

              />

              <Table

                columns={[

                  { key: 'col1', header: 'Columna' },

                  { key: 'col2', header: 'Valor', render: () => 'Demo' },

                ]}

                data={[{ col1: 'Fila 1' }, { col1: 'Fila 2' }]}

              />

            </div>

          )}

        </TabbedContentShell>



        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal de confirmación">

          <p className="text-sm text-gray-600">Ejemplo de diálogo con acciones alineadas a la derecha.</p>

          <ButtonGroup align="end" className="mt-4">

            <ActionButton type="button" variant="outline" onClick={() => setModalOpen(false)}>

              Cancelar

            </ActionButton>

            <ActionButton type="button" onClick={() => setModalOpen(false)}>

              Confirmar

            </ActionButton>

          </ButtonGroup>

        </Modal>

      </ScreenPage>

    </AppLayout>

  );

}

