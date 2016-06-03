(ns match-service-spec
  (:require [speclj.core :refer :all]
            [bob-poc.match.match-service :as match-service]
            [clj-time.core :as t]))

(describe "match service"
  (before (match-service/reset-all-data!))

  (it "should start a new match"
    (should= {:standoff [], :match 0, :time 0} (match-service/get-current-match))
    (match-service/start-match! (t/seconds 15))
    (let [current-match (match-service/get-current-match)]
      (should= true (> (count (:standoff current-match)) 0))
      (should= 1 (:match current-match))
      (should= true (> (:time current-match) 0))))

  (it "should increase vote for a band"
    (match-service/start-match! (t/seconds 15))
    (let [current-match (match-service/get-current-match)
          band (first (:standoff current-match))
          votes (:votes band)
          band-id (:id band)]
      (should= 0 votes)
      (match-service/vote! band-id)
      (match-service/vote! band-id)
      (match-service/vote! band-id)
      (let [updated-band (first (filter #(= (:id %) band-id) (:standoff (match-service/get-current-match))))
            votes (:votes updated-band)]
        (println updated-band)
        (should= 3 votes))))

  (it "should start a next match when called"
    (match-service/start-match! (t/seconds 15))
    (let [first-match (match-service/get-current-match)]
      (should= 1 (:match first-match))
      (match-service/start-match! (t/seconds 15))
      (let [new-match (match-service/get-current-match)]
        (should-not= first-match new-match)
        (should= 2 (:match new-match))))))