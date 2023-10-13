"use client";

import { withAuth } from "@/hocs/withAuth";
import {
  SupernovaTaskComponent,
  createBlankTask,
} from "@/components/supernova-task";
import { TaskBuilderDialog } from "@/components/task-builder-dialog";
import {
  CaretLeftIcon,
  CaretRightIcon,
  ChevronDownIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { settingsRoute } from "@/app/settings/meta";
import { SupernovaCommandCenter } from "@/components/command-center";
import { AlertDialog } from "@/components/alert-dialog";
import { Kbd } from "@/components/kbd";
import { CreateTaskPlaceholder } from "@/components/create-task-placeholder";
import { SupernovaGlobeLogoImage } from "@/components/icons";
import useSupernovaTasksUI from "@/hooks/useSupernovaTasksUI";
import * as Accordion from "@radix-ui/react-accordion";
import React, { useMemo } from "react";
import {
  getDayOfWeek,
  getFormattedMonthDateFromDate,
  isEarlierThan,
  isToday,
} from "@/utils/date";
import {
  filterUnplannedTasks,
  filterViewingDateTasks,
} from "@/utils/supernova-task";
import { twMerge } from "tailwind-merge";
import useShortcuts from "@/hooks/useShortcuts";
import { SupernovaCommand } from "@/types/command";

function Inbox() {
  const {
    accordionValue,
    setAccordionValue,
    taskFetchState,
    taskBuilderIsOpen,
    setTaskBuilderIsOpen,
    chosenTaskIndex,
    memoizedTasksView,
    openTaskBuilder,
    showAreYouSureDialog,
    setShowAreYouSureDialog,
    handleSubmitAreYouSure,
    handleCreateOrUpdateTask,
    handleCheckTask,
    taskListRef,
    crudTaskCommandsList,
    pageNavigationCommandList,
    handleClickTask,
    doneTasks,
    taskListMovementCommandList,
    undoneTasks,
    viewingDate,
  } = useSupernovaTasksUI();

  const inboxUndones = filterUnplannedTasks(undoneTasks);
  const inboxDones = filterUnplannedTasks(doneTasks);

  // register the appropriate shortcuts
  const commands: SupernovaCommand[] = useMemo(
    () => [
      ...crudTaskCommandsList,
      ...pageNavigationCommandList,
      ...taskListMovementCommandList,
    ],
    [
      crudTaskCommandsList,
      pageNavigationCommandList,
      taskListMovementCommandList,
    ]
  );

  useShortcuts(commands);

  return (
    <main className="flex max-h-screen flex-col items-center pt-5 mb-10 px-5 gap-[10px]">
      {showAreYouSureDialog && (
        <AlertDialog
          description={
            <p>
              Are you sure? Task
              <span className="px-1 font-bold text-red-600">
                {chosenTaskIndex !== -1 &&
                  memoizedTasksView[chosenTaskIndex].title}
              </span>
              will be deleted
            </p>
          }
          open={showAreYouSureDialog}
          setOpen={setShowAreYouSureDialog}
          handleSubmit={handleSubmitAreYouSure}
        />
      )}
      <SupernovaCommandCenter
        commands={commands}
        context={{
          chosenTask:
            chosenTaskIndex !== -1 ? memoizedTasksView[chosenTaskIndex] : null,
        }}
      />
      <div className="flex items-center justify-end w-full">
        <Link href={settingsRoute}>
          <GearIcon width={20} height={20} />
        </Link>
      </div>
      {taskBuilderIsOpen && (
        <TaskBuilderDialog
          isOpen={taskBuilderIsOpen}
          onOpenChange={setTaskBuilderIsOpen}
          editingTask={
            chosenTaskIndex !== -1
              ? memoizedTasksView[chosenTaskIndex]
              : createBlankTask()
          }
          mode={chosenTaskIndex !== -1 ? "edit" : "create"}
          onSubmit={handleCreateOrUpdateTask}
        />
      )}
      <div className={twMerge(!isToday(viewingDate) && "opacity-60")}>
        <SupernovaGlobeLogoImage width={30} height={30} priority />
      </div>
      <div className="flex items-center justify-center w-full">
        <h4 className="text-[20px] font-semibold">Inbox</h4>
      </div>
      {taskFetchState.status === "loading" ? (
        <div className="flex items-center gap-[10px]">
          <div className="text-slate-400 text-[16px]">Loading...</div>
        </div>
      ) : taskFetchState.status === "success" ? (
        <div
          className="flex flex-col items-center w-full max-h-full gap-2 max-w-xl"
          ref={taskListRef}
        >
          <hr className="w-64" />
          {inboxUndones.length === 0 && (
            <div className="w-64">
              <p className="text-slate-400 text-[16px] text-center">
                No tasks yet. Press <Kbd>c</Kbd> to create a task, or go to the
                command center with <Kbd>Cmd+k</Kbd>
              </p>
            </div>
          )}
          {inboxUndones.map((task, undoneIndex) => (
            <SupernovaTaskComponent
              key={task.id}
              task={task}
              focused={
                chosenTaskIndex !== -1 &&
                memoizedTasksView[chosenTaskIndex].id === task.id
              }
              onClickCheck={handleCheckTask(task.id)}
              onClick={handleClickTask(undoneIndex)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-[10px]">
          <div className="text-red-600 text-[16px]">{taskFetchState.error}</div>
        </div>
      )}

      <CreateTaskPlaceholder
        onClick={() => {
          openTaskBuilder();
        }}
      />
      <Accordion.Root
        className="w-full max-w-xl"
        type="single"
        value={accordionValue}
        onValueChange={setAccordionValue}
        collapsible
      >
        <Accordion.AccordionItem value="supernova-dones">
          <Accordion.AccordionTrigger className="flex items-center justify-between w-full hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-1">
            <p className="text-xs text-teal-800 dark:text-teal-500">
              Dones ({inboxDones.length})
            </p>{" "}
            <ChevronDownIcon className="text-teal-800" />
          </Accordion.AccordionTrigger>
          <Accordion.AccordionContent className="py-2">
            <div
              className="flex flex-col items-center w-full max-h-full gap-2 overflow-scroll"
              ref={taskListRef}
            >
              {inboxDones.map((task, doneIndex) => (
                <SupernovaTaskComponent
                  key={task.id}
                  task={task}
                  focused={
                    chosenTaskIndex !== -1 &&
                    memoizedTasksView[chosenTaskIndex].id === task.id
                  }
                  onClickCheck={handleCheckTask(task.id)}
                  onClick={handleClickTask(undoneTasks.length + doneIndex)}
                />
              ))}
            </div>
          </Accordion.AccordionContent>
        </Accordion.AccordionItem>
      </Accordion.Root>
    </main>
  );
}

export default withAuth(Inbox);
