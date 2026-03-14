<ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-44 gap-3"
          showsVerticalScrollIndicator={false}
        >
{/_ Book hero _/}
<View className="bg-pomegranate-300 rounded-2xl p-4 flex-row gap-4 items-center">
<Image
source={
book.coverUrl
? { uri: book.coverUrl }
: require("@/assets/images/DummyBookIcon.png")
}
className="w-32 h-44 rounded-xl"
resizeMode="cover"
/>
<View className="flex-1 gap-1">
<Text className="text-base text-pomegranate-950 opacity-70">
You are currently reading
</Text>
<Text className="text-3xl font-bold text-pomegranate-950 leading-tight">
{book.title}
</Text>
</View>
</View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <StatCard
              label={"Time in this\nsession"}
              value={formatDuration(sessionSeconds)}
              flex
            />
            <StatCard
              label={"Total pages read\nso far"}
              value={`${currentPage}/${book.pageCount}`}
              flex
            />
          </View>
          <StatCard
            label="Total time with this book"
            value={formatDuration(totalTimeSeconds + sessionSeconds)}
          />
          <View className="flex-row gap-3">
            <StatCard
              label={"Pages read\nthis session"}
              value={String(pagesReadThisSession)}
              flex
            />
            <StatCard
              label={"Reading pace\n(per hour)"}
              value={`${readingPacePerHour} pg`}
              flex
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              label={"Pages left\nto finish"}
              value={String(pagesLeft)}
              flex
            />
            <StatCard
              label={"Avg session\nlength"}
              value={formatDuration(avgSessionSeconds)}
              flex
            />
          </View>
          <StatCard
            label="Total sessions logged"
            value={String(pastSessions.length)}
          />

          {isRunning && (
            <PageStepper
              currentPage={currentPage}
              pageCount={book.pageCount}
              minPage={book.currentPage}
              onIncrement={() =>
                setCurrentPage((p) => Math.min(book.pageCount, p + 1))
              }
              onDecrement={() =>
                setCurrentPage((p) => Math.max(book.currentPage, p - 1))
              }
            />
          )}
        </ScrollView>

        {/* Bottom action bar */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-pomegranate-50 gap-2">
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleStart}
              disabled={isRunning}
              className={`flex-1 rounded-2xl py-4 items-center justify-center ${
                isRunning ? "bg-pomegranate-100" : "bg-white"
              }`}
            >
              <Text
                className={`text-base font-semibold ${isRunning ? "text-pomegranate-300" : "text-pomegranate-950"}`}
              >
                Start
              </Text>
            </Pressable>
            <Pressable
              onPress={handleEndSession}
              className="flex-1 rounded-2xl py-4 items-center justify-center bg-pomegranate-500"
            >
              <Text className="text-base font-semibold text-white">
                End Session
              </Text>
            </Pressable>
          </View>
          {/* Finish book — always accessible */}
          <Pressable
            onPress={handleFinishBook}
            className="w-full rounded-2xl py-3 items-center justify-center bg-pomegranate-100"
          >
            <Text className="text-base font-semibold text-pomegranate-700">
              ✓ Mark as Finished
            </Text>
          </Pressable>
        </View>
